import React from 'react';
import { 
  CubeIcon, 
  CloudArrowUpIcon, 
  ArrowPathIcon, 
  DevicePhoneMobileIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Real-time AR Viewing',
    description: 'View and interact with your CAD files in augmented reality using MetaQuest devices.',
    icon: EyeIcon,
  },
  {
    name: 'CAD Creation & Editing',
    description: 'Create new CAD files and edit existing ones with intuitive AR tools.',
    icon: PencilIcon,
  },
  {
    name: 'Multiple Export Formats',
    description: 'Export your creations as STL, STEP, or OBJ files for use in other applications.',
    icon: CubeIcon,
  },
  {
    name: 'File Conversion',
    description: 'Backend server with powerful converters using Blender and FreeCAD to convert STL to FBX.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Cloud Storage',
    description: 'Secure file hosting and delivery powered by Supabase for seamless access.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Unity-Powered',
    description: 'Built with Unity for optimal performance and device compatibility.',
    icon: DevicePhoneMobileIcon,
  },
];

const Features: React.FC = () => {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for AR CAD editing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our comprehensive platform provides all the tools necessary for creating, editing, and sharing CAD files in augmented reality.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
