export const localMode = true;
var apiUrl;
var apiHome;
if (localMode) {
  apiHome = 'https://wuxianovels.co/api';
  apiUrl = 'https://wuxianovels.co';
} else {
  apiHome = 'http://localhost:8000/api';
  apiUrl = 'http://localhost:8000';
}
export var apiHome;
export var apiUrl;
