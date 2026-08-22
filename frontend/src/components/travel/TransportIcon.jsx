import React from 'react';
import {
  Plane,
  Train,
  Bus,
  Car,
  Footprints,
  Ship,
  Navigation
} from 'lucide-react';
import { clsx } from 'clsx';

export const getTransportIcon = (type) => {
  if (!type) return Navigation;
  const normalized = String(type).toLowerCase();

  if (normalized.includes('flight') || normalized.includes('air') || normalized.includes('plane')) {
    return Plane;
  }
  if (normalized.includes('train') || normalized.includes('rail') || normalized.includes('shinkansen')) {
    return Train;
  }
  if (normalized.includes('bus') || normalized.includes('coach')) {
    return Bus;
  }
  if (normalized.includes('car') || normalized.includes('drive') || normalized.includes('taxi')) {
    return Car;
  }
  if (normalized.includes('walk') || normalized.includes('foot') || normalized.includes('hike')) {
    return Footprints;
  }
  if (normalized.includes('ferry') || normalized.includes('boat') || normalized.includes('ship') || normalized.includes('cruise')) {
    return Ship;
  }

  return Navigation;
};

export const TransportIcon = ({
  type,
  className = 'w-4 h-4',
  size
}) => {
  const IconComponent = getTransportIcon(type);
  return <IconComponent className={clsx('shrink-0', className)} size={size} />;
};
