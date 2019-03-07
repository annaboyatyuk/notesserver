'use strict';

import notes from '../src/models/notes.js';

export default (dir) => {

  const fakeMongo = {
    find: () => Promise.resolve([]),
    findById: () => Promise.resolve({}),
    save: data => Promise.resolve(data),
    findByIdAndUpdate: () => Promise.resolve({}),
    findByIdAndDelete: () => Promise.resolve({}),
  };

  if(typeof dir !== 'string') {
    return {};
  }
  return {
    'foo': {default:fakeMongo},
    'notes': {default:notes},
  };
};