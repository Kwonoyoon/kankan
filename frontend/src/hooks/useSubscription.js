import { useState } from 'react';
import { loadSubscription, saveSubscription } from '../lib/subscription';

function useSubscription() {
  const [activePlanId, setActivePlanId] = useState(loadSubscription);

  function subscribe(planId) {
    setActivePlanId(planId);
    saveSubscription(planId);
  }

  function cancelSubscription() {
    setActivePlanId(null);
    saveSubscription(null);
  }

  return { activePlanId, subscribe, cancelSubscription };
}

export default useSubscription;
