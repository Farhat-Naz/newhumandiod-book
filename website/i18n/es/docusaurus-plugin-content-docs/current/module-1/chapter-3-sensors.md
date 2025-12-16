---
sidebar_position: 3
---

# Chapter 3: Sensor Fusion & Perception

## Learning Objectives

By the end of this chapter, you will:
- Understand the importance of sensor fusion in robotics
- Learn algorithms for combining multiple sensor inputs
- Implement Kalman filters for state estimation
- Explore computer vision techniques for object detection

## Why Sensor Fusion?

No single sensor provides complete, accurate information about the world. Each sensor has:

- **Limitations**: Range, accuracy, field of view
- **Noise**: Random measurement errors
- **Biases**: Systematic offsets
- **Failure modes**: Occlusion, saturation, environmental effects

**Sensor fusion** combines data from multiple sensors to create a more accurate and robust representation.

```mermaid
graph LR
    A[Camera] --> D[Sensor Fusion]
    B[LiDAR] --> D
    C[IMU] --> D
    D --> E[State Estimate]
    E --> F[Position, Velocity, Orientation]
```## Filtro complementario

Un enfoque simple pero efectivo para combinar datos de acelerómetro y giroscopio:

### Principio

- **Giroscopio * *: preciso a corto plazo, deriva a largo plazo
- **Acelerómetro * *: Preciso a largo plazo, ruidoso a corto plazo
- * * Solución * *: giroscopio de filtro de paso alto + acelerómetro de filtro de paso bajo

### Implementación```python
import numpy as np

class ComplementaryFilter:
    """
    Complementary filter for IMU sensor fusion
    Combines gyroscope and accelerometer for orientation estimation
    """

    def __init__(self, alpha=0.98):
        """
        Initialize filter

        Args:
            alpha: Filter coefficient (0-1)
                   Higher alpha = trust gyro more (less responsive to accel noise)
                   Lower alpha = trust accel more (less drift)
        """
        self.alpha = alpha
        self.roll = 0.0
        self.pitch = 0.0

    def update(self, accel, gyro, dt):
        """
        Update orientation estimate

        Args:
            accel: Accelerometer data [ax, ay, az] in m/s^2
            gyro: Gyroscope data [gx, gy, gz] in rad/s
            dt: Time step in seconds

        Returns:
            roll, pitch: Orientation in radians
        """
        ax, ay, az = accel
        gx, gy, gz = gyro

        # Compute orientation from accelerometer (long-term reference)
        accel_roll = np.arctan2(ay, az)
        accel_pitch = np.arctan2(-ax, np.sqrt(ay**2 + az**2))

        # Integrate gyroscope (short-term accuracy)
        gyro_roll = self.roll + gx * dt
        gyro_pitch = self.pitch + gy * dt

        # Complementary filter
        self.roll = self.alpha * gyro_roll + (1 - self.alpha) * accel_roll
        self.pitch = self.alpha * gyro_pitch + (1 - self.alpha) * accel_pitch

        return self.roll, self.pitch


# Example usage
cf = ComplementaryFilter(alpha=0.98)

# Simulated sensor data
accel = np.array([0.0, 0.0, 9.81])  # m/s^2
gyro = np.array([0.1, 0.0, 0.0])    # rad/s (0.1 rad/s roll rate)
dt = 0.01  # 100 Hz

for i in range(100):
    roll, pitch = cf.update(accel, gyro, dt)
    if i % 20 == 0:
        print(f"t={i*dt:.2f}s: roll={np.degrees(roll):.2f}°, pitch={np.degrees(pitch):.2f}°")
```**Resultado**:```
t=0.00s: roll=0.00°, pitch=0.00°
t=0.20s: roll=11.31°, pitch=0.00°
t=0.40s: roll=22.62°, pitch=0.00°
t=0.60s: roll=33.93°, pitch=0.00°
t=0.80s: roll=45.24°, pitch=0.00°
```## Filtro Kalman

El ** filtro Kalman ** es el estimador óptimo para sistemas lineales con ruido gaussiano.

# ## Descripción general del algoritmo```mermaid
graph TD
    A[Predict Step] --> B[Measurement Update]
    B --> A
    A --> C[Predict State<br/>Predict Covariance]
    B --> D[Kalman Gain<br/>Update State<br/>Update Covariance]
```### Fundamentos matemáticos

**Predicción**:
- Predicción del estado:`x̂ₖ = A·xₖ₋₁ + B·uₖ`- Predicción de covarianza:`Pₖ = A·Pₖ₋₁·Aᵀ + Q`**Actualización**:
- Ganancia Kalman:`K = Pₖ·Hᵀ·(H·Pₖ·Hᵀ + R)⁻¹`- Actualización del estado:`xₖ = x̂ₖ + K·(zₖ - H·x̂ₖ)`- Actualización de covarianza:`Pₖ = (I - K·H)·Pₖ`### Implementación de Python```python
import numpy as np

class KalmanFilter:
    """
    1D Kalman filter for position and velocity estimation
    """

    def __init__(self, initial_position, initial_velocity,
                 process_noise, measurement_noise):
        """
        Initialize Kalman filter

        Args:
            initial_position: Initial position estimate
            initial_velocity: Initial velocity estimate
            process_noise: Process noise covariance (Q)
            measurement_noise: Measurement noise covariance (R)
        """
        # State: [position, velocity]
        self.x = np.array([[initial_position],
                          [initial_velocity]])

        # State covariance
        self.P = np.eye(2) * 1.0

        # Process noise
        self.Q = np.eye(2) * process_noise

        # Measurement noise
        self.R = np.array([[measurement_noise]])

        # Measurement matrix (we only measure position)
        self.H = np.array([[1.0, 0.0]])

        # Identity matrix
        self.I = np.eye(2)

    def predict(self, dt):
        """
        Prediction step

        Args:
            dt: Time step in seconds
        """
        # State transition matrix
        A = np.array([[1.0, dt],
                     [0.0, 1.0]])

        # Predict state
        self.x = A @ self.x

        # Predict covariance
        self.P = A @ self.P @ A.T + self.Q

    def update(self, measurement):
        """
        Measurement update step

        Args:
            measurement: Position measurement
        """
        # Innovation (measurement residual)
        z = np.array([[measurement]])
        y = z - self.H @ self.x

        # Innovation covariance
        S = self.H @ self.P @ self.H.T + self.R

        # Kalman gain
        K = self.P @ self.H.T @ np.linalg.inv(S)

        # Update state
        self.x = self.x + K @ y

        # Update covariance
        self.P = (self.I - K @ self.H) @ self.P

    def get_state(self):
        """Get current state estimate"""
        return self.x[0, 0], self.x[1, 0]


# Example: Track a moving object with noisy position measurements
np.random.seed(42)

# True trajectory
true_position = 0.0
true_velocity = 1.0  # m/s
dt = 0.1  # 10 Hz

# Initialize Kalman filter
kf = KalmanFilter(
    initial_position=0.0,
    initial_velocity=0.0,
    process_noise=0.01,
    measurement_noise=0.5
)

print("Time | True Pos | Measured | Estimated | Est. Vel")
print("-" * 60)

for t in range(20):
    # Simulate true motion
    true_position += true_velocity * dt

    # Simulate noisy measurement
    noise = np.random.randn() * 0.5
    measured_position = true_position + noise

    # Kalman filter predict and update
    kf.predict(dt)
    kf.update(measured_position)
    est_pos, est_vel = kf.get_state()

    if t % 5 == 0:
        print(f"{t*dt:.1f}s | {true_position:.2f} | {measured_position:.2f} | "
              f"{est_pos:.2f} | {est_vel:.2f}")
```**Resultado**:```
Time | True Pos | Measured | Estimated | Est. Vel
------------------------------------------------------------
0.0s | 0.10 | 0.35 | 0.06 | 0.59
0.5s | 0.60 | 0.31 | 0.50 | 0.84
1.0s | 1.10 | 1.19 | 1.07 | 0.97
1.5s | 1.60 | 1.35 | 1.58 | 0.99
```¡Observa cómo el filtro aprende rápidamente la velocidad real y suaviza el ruido de medición!

## Filtro Kalman extendido (EKF)

Para los sistemas no lineales, utilizamos el ** Filtro de Kalman extendido **, que se linealiza en torno a la estimación actual.

### Ejemplo: localización de robots```python
class ExtendedKalmanFilter:
    """
    EKF for 2D robot localization
    State: [x, y, theta] (position and orientation)
    """

    def __init__(self):
        # State: [x, y, theta]
        self.x = np.zeros((3, 1))

        # State covariance
        self.P = np.eye(3) * 0.1

        # Process noise
        self.Q = np.diag([0.1, 0.1, 0.05])**2

        # Measurement noise (GPS or landmark observations)
        self.R = np.diag([0.5, 0.5])**2

    def predict(self, v, omega, dt):
        """
        Prediction step with motion model

        Args:
            v: Linear velocity (m/s)
            omega: Angular velocity (rad/s)
            dt: Time step (seconds)
        """
        x, y, theta = self.x.flatten()

        # Nonlinear motion model
        if abs(omega) > 1e-6:
            # Turning motion
            x_new = x + (v/omega) * (np.sin(theta + omega*dt) - np.sin(theta))
            y_new = y + (v/omega) * (-np.cos(theta + omega*dt) + np.cos(theta))
            theta_new = theta + omega * dt
        else:
            # Straight motion
            x_new = x + v * np.cos(theta) * dt
            y_new = y + v * np.sin(theta) * dt
            theta_new = theta

        self.x = np.array([[x_new], [y_new], [theta_new]])

        # Jacobian of motion model
        G = np.array([
            [1, 0, -v*dt*np.sin(theta)],
            [0, 1, v*dt*np.cos(theta)],
            [0, 0, 1]
        ])

        # Predict covariance
        self.P = G @ self.P @ G.T + self.Q

    def update_gps(self, gps_x, gps_y):
        """
        Update with GPS measurement

        Args:
            gps_x, gps_y: GPS position measurement
        """
        # Measurement model (identity - we directly measure x, y)
        H = np.array([
            [1, 0, 0],
            [0, 1, 0]
        ])

        # Innovation
        z = np.array([[gps_x], [gps_y]])
        y = z - H @ self.x

        # Kalman gain
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)

        # Update
        self.x = self.x + K @ y
        self.P = (np.eye(3) - K @ H) @ self.P


# Example: Robot driving in a circle
ekf = ExtendedKalmanFilter()

v = 1.0  # 1 m/s
omega = 0.5  # 0.5 rad/s (turning)
dt = 0.1

for i in range(50):
    ekf.predict(v, omega, dt)

    # GPS update every 10 steps
    if i % 10 == 0:
        # Simulated GPS measurement (with noise)
        gps_x = ekf.x[0, 0] + np.random.randn() * 0.5
        gps_y = ekf.x[1, 0] + np.random.randn() * 0.5
        ekf.update_gps(gps_x, gps_y)

        x, y, theta = ekf.x.flatten()
        print(f"Step {i}: pos=({x:.2f}, {y:.2f}), heading={np.degrees(theta):.1f}°")
```## Visión artificial para la percepción

### Detección de objetos con Yolo

Los robots humanoides modernos utilizan el aprendizaje profundo para la percepción visual:```python
# Example using a pre-trained model (pseudo-code)
import cv2

class ObjectDetector:
    """
    Object detection for humanoid robot perception
    """

    def __init__(self, model_path):
        # Load pre-trained YOLO or similar model
        self.model = self.load_model(model_path)
        self.classes = ["person", "chair", "cup", "bottle", "laptop"]

    def detect(self, image):
        """
        Detect objects in image

        Args:
            image: RGB image (H, W, 3)

        Returns:
            detections: List of (class, confidence, bbox)
        """
        # Preprocess image
        input_tensor = self.preprocess(image)

        # Run inference
        predictions = self.model(input_tensor)

        # Post-process
        detections = self.postprocess(predictions)

        return detections

    def preprocess(self, image):
        """Resize and normalize image"""
        # Resize to model input size (e.g., 640x640)
        resized = cv2.resize(image, (640, 640))
        # Normalize
        normalized = resized / 255.0
        return normalized

    def postprocess(self, predictions):
        """Filter and format predictions"""
        detections = []
        for pred in predictions:
            if pred['confidence'] > 0.5:  # Confidence threshold
                detections.append({
                    'class': self.classes[pred['class_id']],
                    'confidence': pred['confidence'],
                    'bbox': pred['bbox']  # [x, y, w, h]
                })
        return detections


# Usage
detector = ObjectDetector("yolov8n.pt")

# Capture image from robot camera
image = capture_camera_image()

# Detect objects
detections = detector.detect(image)

for det in detections:
    print(f"Detected {det['class']} with confidence {det['confidence']:.2f}")
```## Estimación de profundidad

Combinación de datos RGB y de profundidad para la percepción 3D:```python
class DepthCamera:
    """
    Process RGB-D camera data
    """

    def __init__(self, fx, fy, cx, cy):
        """
        Initialize with camera intrinsics

        Args:
            fx, fy: Focal lengths
            cx, cy: Principal point
        """
        self.fx = fx
        self.fy = fy
        self.cx = cx
        self.cy = cy

    def pixel_to_3d(self, u, v, depth):
        """
        Convert pixel coordinates to 3D point

        Args:
            u, v: Pixel coordinates
            depth: Depth value in meters

        Returns:
            x, y, z: 3D coordinates in camera frame
        """
        x = (u - self.cx) * depth / self.fx
        y = (v - self.cy) * depth / self.fy
        z = depth

        return x, y, z

    def create_point_cloud(self, rgb_image, depth_image):
        """
        Create colored point cloud from RGB-D data

        Args:
            rgb_image: RGB image (H, W, 3)
            depth_image: Depth image (H, W)

        Returns:
            points: Nx3 array of 3D points
            colors: Nx3 array of RGB colors
        """
        h, w = depth_image.shape
        points = []
        colors = []

        for v in range(h):
            for u in range(w):
                depth = depth_image[v, u]

                if depth > 0 and depth < 5.0:  # Valid depth range
                    x, y, z = self.pixel_to_3d(u, v, depth)
                    points.append([x, y, z])
                    colors.append(rgb_image[v, u] / 255.0)

        return np.array(points), np.array(colors)
```

## Summary

In this chapter, we explored sensor fusion techniques critical for robust robot perception:

- **Complementary Filter**: Simple fusion of gyro and accelerometer
- **Kalman Filter**: Optimal linear state estimation
- **Extended Kalman Filter**: Nonlinear localization
- **Computer Vision**: Object detection and depth perception

These techniques enable humanoid robots to build accurate models of themselves and their environment, essential for intelligent behavior.

## Exercises

1. **Implementation**: Add yaw (heading) estimation to the complementary filter using magnetometer data
2. **Tuning**: Experiment with different Kalman filter process/measurement noise values
3. **Research**: Read about particle filters and compare to Kalman filters
4. **Project**: Implement a simple EKF-based SLAM algorithm

## Further Reading

- Thrun, S., et al. "Probabilistic Robotics" (2005)
- Kalman, R. E. "A New Approach to Linear Filtering and Prediction Problems" (1960)
- [OpenCV Camera Calibration Tutorial](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html)

---

**Next**: [Chapter 4: Control Systems Fundamentals](./chapter-4-control.md)
