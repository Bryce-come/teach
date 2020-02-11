import Vue from 'vue';
import { isNumber, formatDateTime, formatDate } from 'web-toolkit/src/utils';

Vue.filter('datetime', (value?: number | Date) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '- -';
    } else {
      return formatDateTime(date);
    }
  } else if (value instanceof Date) {
    return formatDateTime(value);
  } else {
    return '- -';
  }
});

Vue.filter('date', (value?: number | Date) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '- -';
    } else {
      return formatDate(date);
    }
  } else if (value instanceof Date) {
    return formatDate(value);
  } else {
    return '- -';
  }
});
