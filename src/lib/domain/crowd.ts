export interface CrowdRecommendation {
  content: string;
}

export function getCrowdRecommendations(): CrowdRecommendation[] {
  return [
    { content: "Open Gate B auxiliary lanes to reduce South Stand congestion" },
    { content: "Deploy 4 volunteers to South Concourse for flow guidance" },
    { content: "Redirect incoming fans from Gate E to Gate C (18 min faster)" },
    { content: "Activate overflow seating protocol in East Stand" },
  ];
}

export interface EmergencyAction {
  step: number;
  action: string;
}

export function getEmergencyActions(): EmergencyAction[] {
  return [
    { step: 1, action: "Deploy security team to North Parking Lot — unauthorized vehicle" },
    { step: 2, action: "Open Gate B auxiliary lanes to relieve South Stand congestion" },
    { step: 3, action: "Alert medical team — heat exhaustion case resolved, monitor East Concourse" },
    { step: 4, action: "Notify fans via app: redirect Gate E traffic to Gate C" },
  ];
}
