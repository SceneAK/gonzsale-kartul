import ApplicationError from '../common/errors.js';
import orderItemServices from './orderItemServices.js';
import orderServices from './orderServices.js';
import productServices from './productServices.js';
import storeServices from './storeServices.js';

// Use this in case orderItemServices needs updateStatus to fetch orderServices and creates a circular dependency.

export default {}