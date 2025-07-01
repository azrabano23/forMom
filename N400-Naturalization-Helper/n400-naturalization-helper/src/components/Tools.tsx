import React from 'react';
import { 
  ArrowsPointingOutIcon, 
  ScaleIcon, 
  ChatBubbleLeftRightIcon, 
  Squares2X2Icon 
} from '@heroicons/react/24/outline';

const tools = [
  {
    name: 'Object Rotator & Scaling',
    description: 'Rotate and scale objects with precision using intuitive AR gestures and controls.',
    icon: ArrowsPointingOutIcon,
    features: ['360-degree rotation', 'Precise scaling controls', 'Multi-touch gestures', 'Lock axis functionality']
  },
  {
    name: 'Measuring Tool',
    description: 'Measure distances, angles, and dimensions with high accuracy in AR space.',
    icon: ScaleIcon,
    features: ['Distance measurement', 'Angle calculation', 'Area measurement', 'Real-time updates']
  },
  {
    name: 'Annotation System',
    description: 'Add notes and annotations to your CAD models for better collaboration.',
    icon: ChatBubbleLeftRightIcon,
    features: ['Text annotations', 'Voice notes', 'Color coding', 'Export annotations']
  },
  {
    name: 'Shape Library',
    description: 'Access a comprehensive library of shapes and primitives for quick CAD creation.',
    icon: Squares2X2Icon,
    features: ['Basic shapes', 'Complex geometries', 'Custom shapes', 'Shape combinations']
  },
];

const Tools: React.FC = () => {
  return (
    <div id="tools" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">AR Tools</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful tools for AR CAD editing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our suite of AR tools provides everything you need to create, modify, and analyze CAD models in three-dimensional space.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mr-4">
                    <tool.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{tool.name}</h3>
                </div>
                
                <p className="text-base text-gray-500 mb-4">{tool.description}</p>
                
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
