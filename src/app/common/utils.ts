export const apiEndPoint = {
  validateLogin: `GuestEngagement/GuestEngagementService.svc/jsonp/ValidateLogin`,
  logon: `jazzfusion/api/Logon`,
  propertyList: `api/PropertyList`,
  portalUserProfile: `GuestEngagement/GuestEngagementService.svc/jsonp/GetPortalUserProfile`,
  guestRoomList: `PropertyService/PropertyService.svc/jsonp/GetGuestRoomList`,
  speedDialList: `PropertyService/PropertyService.svc/jsonp/GetSpeedDialList`,
  extendSession: `GuestEngagement/GuestEngagementService.svc/jsonp/ExtendSession`,
};

export const routerList = {
  default: `login/default`,
  callAction: 'dashboard/call-action',
};
