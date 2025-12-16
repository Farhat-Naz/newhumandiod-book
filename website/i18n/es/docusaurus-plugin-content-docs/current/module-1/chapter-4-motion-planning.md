---
sidebar_position: 4
---
# Capítulo 4: Planificación y control de movimiento

## Objetivos de aprendizaje

Al final de este capítulo, usted:
- Comprender los algoritmos fundamentales de planificación de movimiento
- Aprender técnicas de planificación de rutas para robótica
- Implementar sistemas básicos de control para la navegación del robot
- Explorar estrategias para evitar obstáculos
- Aplicar métodos de generación de trayectorias

## Por qué es importante la planificación de movimientosLa planificación de movimiento es el problema computacional de encontrar una secuencia de configuraciones válidas que mueva un robot de una fuente a un destino. Es esencial para:

- ** Navegación autónoma **: robots y vehículos autónomos
- **Manipulación**: Brazos de robot recogiendo y colocando objetos
- **Exploración**: Navegación por entornos no mapeados
- **Seguridad**: Movimiento sin colisiones en entornos dinámicos```mermaid
graph LR
    A[Current Position] --> B[Motion Planner]
    C[Goal Position] --> B
    D[Environment Map] --> B
    B --> E[Path/Trajectory]
    E --> F[Controller]
    F --> G[Robot Motion]
```## Espacio de configuración (C-Space)

El ** espacio de configuración ** representa todos los estados posibles de un robot:

### Conceptos clave

- **Configuración (q)**: Descripción completa de la posición/orientación del robot
- ** Espacio libre (C_free)**: Configuraciones sin colisiones
- ** Espacio de obstáculos (C_obs)**: Configuraciones que causan colisiones
- **Objetivo**: Encuentra la ruta en C_free desde q_start hasta q_goal### Ejemplo: Robot 2D

Para un robot de puntos en 2D:
- Configuración: (x, y)
- Dimensión del espacio C: 2
- Obstáculos: regiones a evitar

Para un robot con orientación:
- Configuración: (x, y, θ)
- Dimensión del espacio C: 3

## Planificación basada en gráficos

### Algoritmo de Dijkstra

Encuentra el camino más corto en los gráficos ponderados:```python
import heapq
from typing import Dict, List, Tuple

class GraphPlanner:
    def __init__(self, graph: Dict[str, List[Tuple[str, float]]]):
        """
        graph: {node: [(neighbor, cost), ...]}
        """
        self.graph = graph

    def dijkstra(self, start: str, goal: str) -> Tuple[List[str], float]:
        """
        Find shortest path using Dijkstra's algorithm

        Returns:
            path: List of nodes from start to goal
            cost: Total path cost
        """
        # Priority queue: (cost, node)
        pq = [(0, start)]
        visited = set()
        cost_so_far = {start: 0}
        came_from = {start: None}

        while pq:
            current_cost, current = heapq.heappop(pq)

            if current in visited:
                continue

            visited.add(current)

            if current == goal:
                # Reconstruct path
                path = []
                while current is not None:
                    path.append(current)
                    current = came_from[current]
                return path[::-1], cost_so_far[goal]

            # Explore neighbors
            for neighbor, edge_cost in self.graph.get(current, []):
                new_cost = current_cost + edge_cost

                if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                    cost_so_far[neighbor] = new_cost
                    came_from[neighbor] = current
                    heapq.heappush(pq, (new_cost, neighbor))

        return [], float('inf')  # No path found

# Example usage
graph = {
    'A': [('B', 1), ('C', 4)],
    'B': [('C', 2), ('D', 5)],
    'C': [('D', 1)],
    'D': []
}

planner = GraphPlanner(graph)
path, cost = planner.dijkstra('A', 'D')
print(f"Path: {path}, Cost: {cost}")
# Output: Path: ['A', 'B', 'C', 'D'], Cost: 4
```### A* Algoritmo

Mejora Dijkstra con heurística para una búsqueda más rápida:```python
import heapq
import math
from typing import Dict, Tuple

class AStarPlanner:
    def __init__(self, grid: List[List[int]]):
        """
        grid: 2D array (0=free, 1=obstacle)
        """
        self.grid = grid
        self.rows = len(grid)
        self.cols = len(grid[0])

    def heuristic(self, a: Tuple[int, int], b: Tuple[int, int]) -> float:
        """Euclidean distance heuristic"""
        return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

    def get_neighbors(self, pos: Tuple[int, int]) -> List[Tuple[int, int]]:
        """Get valid neighbors (8-connected)"""
        x, y = pos
        neighbors = []

        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue

                nx, ny = x + dx, y + dy

                # Check bounds
                if 0 <= nx < self.rows and 0 <= ny < self.cols:
                    # Check if free
                    if self.grid[nx][ny] == 0:
                        neighbors.append((nx, ny))

        return neighbors

    def plan(self, start: Tuple[int, int], goal: Tuple[int, int]) -> List[Tuple[int, int]]:
        """
        A* path planning

        Returns:
            path: List of (x, y) coordinates from start to goal
        """
        # Priority queue: (f_score, node)
        pq = [(0, start)]
        came_from = {}
        g_score = {start: 0}
        f_score = {start: self.heuristic(start, goal)}

        while pq:
            _, current = heapq.heappop(pq)

            if current == goal:
                # Reconstruct path
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                return path[::-1]

            for neighbor in self.get_neighbors(current):
                # Cost to neighbor (diagonal = sqrt(2), straight = 1)
                dx = abs(neighbor[0] - current[0])
                dy = abs(neighbor[1] - current[1])
                cost = math.sqrt(2) if (dx + dy == 2) else 1

                tentative_g = g_score[current] + cost

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + self.heuristic(neighbor, goal)
                    heapq.heappush(pq, (f_score[neighbor], neighbor))

        return []  # No path found

# Example usage
grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0]
]

planner = AStarPlanner(grid)
path = planner.plan((0, 0), (4, 4))
print(f"A* Path: {path}")
```## Planificación basada en el muestreo

Para espacios de alta dimensión, los métodos basados en muestreo son más eficientes.

### Árbol aleatorio de exploración rápida (RRT)

Cultiva un árbol mediante muestreo aleatorio:```python
import numpy as np
import random

class RRTPlanner:
    def __init__(self, start, goal, obstacles, bounds, max_iter=1000, step_size=0.5):
        """
        start: Starting position (x, y)
        goal: Goal position (x, y)
        obstacles: List of (x, y, radius) circles
        bounds: ((x_min, x_max), (y_min, y_max))
        """
        self.start = np.array(start)
        self.goal = np.array(goal)
        self.obstacles = obstacles
        self.bounds = bounds
        self.max_iter = max_iter
        self.step_size = step_size

        # Tree: {node: parent}
        self.tree = {tuple(self.start): None}
        self.nodes = [self.start]

    def random_sample(self):
        """Generate random configuration"""
        x = random.uniform(self.bounds[0][0], self.bounds[0][1])
        y = random.uniform(self.bounds[1][0], self.bounds[1][1])
        return np.array([x, y])

    def nearest_node(self, point):
        """Find nearest node in tree"""
        distances = [np.linalg.norm(node - point) for node in self.nodes]
        idx = np.argmin(distances)
        return self.nodes[idx]

    def steer(self, from_node, to_point):
        """Create new node by steering from from_node towards to_point"""
        direction = to_point - from_node
        distance = np.linalg.norm(direction)

        if distance < self.step_size:
            return to_point

        direction = direction / distance  # Normalize
        return from_node + direction * self.step_size

    def is_collision_free(self, from_node, to_node):
        """Check if edge is collision-free"""
        # Check collision with obstacles
        for obs_x, obs_y, obs_r in self.obstacles:
            obs_center = np.array([obs_x, obs_y])

            # Check multiple points along the edge
            for t in np.linspace(0, 1, 10):
                point = from_node + t * (to_node - from_node)
                if np.linalg.norm(point - obs_center) < obs_r:
                    return False

        return True

    def plan(self):
        """
        RRT path planning

        Returns:
            path: List of (x, y) waypoints from start to goal
        """
        for i in range(self.max_iter):
            # Sample random point (bias towards goal sometimes)
            if random.random() < 0.1:
                rand_point = self.goal
            else:
                rand_point = self.random_sample()

            # Find nearest node
            nearest = self.nearest_node(rand_point)

            # Steer towards random point
            new_node = self.steer(nearest, rand_point)

            # Check collision
            if self.is_collision_free(nearest, new_node):
                # Add to tree
                self.tree[tuple(new_node)] = tuple(nearest)
                self.nodes.append(new_node)

                # Check if goal reached
                if np.linalg.norm(new_node - self.goal) < self.step_size:
                    # Add goal to tree
                    self.tree[tuple(self.goal)] = tuple(new_node)

                    # Reconstruct path
                    path = [self.goal]
                    current = tuple(self.goal)

                    while current is not None:
                        path.append(np.array(current))
                        current = self.tree[current]

                    return path[::-1]

        return []  # No path found

# Example usage
obstacles = [(2, 2, 0.5), (3, 1, 0.3), (1, 3, 0.4)]
bounds = ((0, 5), (0, 5))

rrt = RRTPlanner(
    start=(0, 0),
    goal=(4, 4),
    obstacles=obstacles,
    bounds=bounds
)

path = rrt.plan()
print(f"RRT Path: {len(path)} waypoints")
```## Control de movimiento

Una vez que se planifica una ruta, necesitamos que los controladores la sigan.

### Control PID

Control proporcional-integral-derivado para el seguimiento de la trayectoria:```python
class PIDController:
    def __init__(self, kp, ki, kd, dt):
        """
        kp: Proportional gain
        ki: Integral gain
        kd: Derivative gain
        dt: Time step
        """
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.dt = dt

        self.integral = 0
        self.prev_error = 0

    def compute(self, setpoint, current_value):
        """
        Compute control output

        Args:
            setpoint: Desired value
            current_value: Current measured value

        Returns:
            control: Control signal
        """
        # Error
        error = setpoint - current_value

        # Proportional term
        p_term = self.kp * error

        # Integral term
        self.integral += error * self.dt
        i_term = self.ki * self.integral

        # Derivative term
        derivative = (error - self.prev_error) / self.dt
        d_term = self.kd * derivative

        # Update previous error
        self.prev_error = error

        # Total control
        control = p_term + i_term + d_term

        return control

    def reset(self):
        """Reset controller state"""
        self.integral = 0
        self.prev_error = 0

# Example: Position control
pid = PIDController(kp=1.0, ki=0.1, kd=0.05, dt=0.01)

# Simulation
position = 0.0
velocity = 0.0
target = 10.0

for t in range(1000):
    # Compute control
    control = pid.compute(target, position)

    # Simple dynamics: acceleration = control
    velocity += control * 0.01
    position += velocity * 0.01

    if t % 100 == 0:
        print(f"t={t*0.01:.2f}s, pos={position:.2f}, error={target-position:.2f}")
```## Evitación de obstáculos

### Enfoque de ventana dinámica (DWA)

Para evitar obstáculos locales en entornos dinámicos:```python
class DWA:
    def __init__(self, max_speed=1.0, max_angular_speed=1.0):
        self.max_speed = max_speed
        self.max_angular_speed = max_angular_speed

    def compute_velocity(self, current_vel, obstacles, goal):
        """
        Compute optimal velocity considering obstacles and goal

        Args:
            current_vel: (v, w) - linear and angular velocity
            obstacles: List of (x, y, radius)
            goal: (x, y) goal position

        Returns:
            best_vel: (v, w) optimal velocity
        """
        # Sample velocities in dynamic window
        v_samples = np.linspace(0, self.max_speed, 10)
        w_samples = np.linspace(-self.max_angular_speed, self.max_angular_speed, 20)

        best_score = -float('inf')
        best_vel = (0, 0)

        for v in v_samples:
            for w in w_samples:
                # Predict trajectory
                score = self.evaluate_trajectory(v, w, obstacles, goal)

                if score > best_score:
                    best_score = score
                    best_vel = (v, w)

        return best_vel

    def evaluate_trajectory(self, v, w, obstacles, goal):
        """Evaluate trajectory quality"""
        # Simulate forward
        x, y, theta = 0, 0, 0
        dt = 0.1

        for t in range(10):  # 1 second prediction
            x += v * math.cos(theta) * dt
            y += v * math.sin(theta) * dt
            theta += w * dt

            # Check collision
            for obs_x, obs_y, obs_r in obstacles:
                dist = math.sqrt((x - obs_x)**2 + (y - obs_y)**2)
                if dist < obs_r:
                    return -float('inf')  # Collision

        # Score based on distance to goal
        goal_dist = math.sqrt((x - goal[0])**2 + (y - goal[1])**2)
        score = -goal_dist  # Minimize distance to goal

        return score
```## Ejercicios

1. **Implementar A\***: Modificar el planificador A* para trabajar con diferentes heurísticas (Manhattan, Chebyshev)

2. ** Variantes RRT **: Implementar RRT* que optimiza la ruta recableando

3. ** Ajuste del controlador **: ajuste las ganancias de PID para un sistema de segundo orden

4. ** Alisado de trayectoria **: Alisa una trayectoria A* con splines o curvas Bezier5. ** Planificación de múltiples robots **: extienda los planificadores para manejar múltiples robots que se evitan entre sí

## Resumen

En este capítulo, hemos cubierto:- ** Fundamentos de planificación de movimiento ** y espacios de configuración
- ** Métodos basados en gráficos **: Dijkstra y A* para una planificación óptima de la ruta
- ** Métodos basados en muestreo**: TRR para espacios de alta dimensión
- ** Sistemas de control **: control PID para seguimiento de trayectoria
- ** Evitación de obstáculos **: DWA para entornos dinámicosEstas técnicas forman la base para la navegación autónoma y la manipulación en sistemas físicos de IA.

## Recursos adicionales- [Curso de planificación de movimiento (MIT)](https://ocw.mit.edu/courses/aeronautics-and-astronautics/)
- [Algoritmos de planificación (LaValle)](http://lavalle.pl/planning/)
- [ROS Navigation Stack](https://navigation.ros.org/)
- [Modern Robotics (Lynch & Park)](http://hades.mech.northwestern.edu/index.php/Modern_Robotics)

## Próximos pasosEn el Capítulo 5, integraremos estos conceptos de planificación y control con ROS 2 para construir un sistema de navegación completo para robots físicos de IA.