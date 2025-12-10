import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebars configuration for Physical AI & Humanoid Robotics Course
 *
 * Structure:
 * - Introduction
 * - Module 1: Foundations of Physical AI & Humanoid Robotics
 * - Module 2: ROS 2 & Gazebo Simulation
 * - Module 3: Unity Integration & Isaac Sim
 * - Module 4: Vision-Language-Action (VLA) Systems
 */
const sidebars: SidebarsConfig = {
  // Main tutorial sidebar
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Module 1: Foundations of Physical AI',
      link: {
        type: 'generated-index',
        title: 'Module 1: Foundations of Physical AI & Humanoid Robotics',
        description:
          'Learn the foundations of Physical AI and humanoid robotics, including hardware systems, sensors, perception, and control fundamentals.',
        slug: '/category/module-1',
      },
      items: [
        'module-1/chapter-1-intro',
        'module-1/chapter-2-hardware',
        'module-1/chapter-3-sensors',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: ROS 2 & Gazebo',
      link: {
        type: 'generated-index',
        title: 'Module 2: ROS 2 & Gazebo Simulation',
        description:
          'Master ROS 2 architecture, URDF modeling, Gazebo simulation, and navigation stack for building intelligent robotic systems.',
        slug: '/category/module-2',
      },
      items: [
        'module-2/chapter-5-ros2-intro',
        // Additional chapters to be added:
        // 'module-2/chapter-6-urdf',
        // 'module-2/chapter-7-gazebo',
        // 'module-2/chapter-8-navigation',
      ],
    },
    // Module 3 placeholder
    // {
    //   type: 'category',
    //   label: 'Module 3: Unity & Isaac Sim',
    //   link: {
    //     type: 'generated-index',
    //     title: 'Module 3: Unity Integration & Isaac Sim',
    //     description:
    //       'Learn Unity for robotics simulation, NVIDIA Isaac Sim for photorealistic environments, and reinforcement learning integration.',
    //     slug: '/category/module-3',
    //   },
    //   items: [
    //     // 'module-3/chapter-9-unity-basics',
    //     // 'module-3/chapter-10-isaac-sim',
    //     // 'module-3/chapter-11-rl-integration',
    //   ],
    // },
    // Module 4 placeholder
    // {
    //   type: 'category',
    //   label: 'Module 4: VLA Systems',
    //   link: {
    //     type: 'generated-index',
    //     title: 'Module 4: Vision-Language-Action (VLA) Systems',
    //     description:
    //       'Explore vision-language models for robotics, action prediction, multi-modal perception, and real-world deployment.',
    //     slug: '/category/module-4',
    //   },
    //   items: [
    //     // 'module-4/chapter-12-vla-intro',
    //     // 'module-4/chapter-13-action-prediction',
    //     // 'module-4/chapter-14-deployment',
    //   ],
    // },
  ],
};

export default sidebars;
