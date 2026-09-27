const STORAGE_KEY = 'kany.subscription';

export function loadSubscription() {
  return localStorage.getItem(STORAGE_KEY);
}

export function saveSubscription(planId) {
  if (planId) {
    localStorage.setItem(STORAGE_KEY, planId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
