interface icon {
  name: string;
  icon: string;
}
export abstract class IconCollection {
  constructor() {}
  private static iconList: icon[] = [
    {
      name: 'Missed',
      icon: 'phone_missed',
    },
    {
      name: 'Decline',
      icon: 'call_end',
    },
    {
      name: 'Incoming',
      icon: 'phone_callback',
    },
    {
      name: 'Outgoing',
      icon: 'phone_forwarded',
    },
    {
      name: 'VIP',
      icon: 'crown',
    },
    {
      name: 'Emergency',
      icon: 'wb_twilight',
    },
    {
      name: 'Robot',
      icon: 'smart_toy',
    },
  ];
  public static getIcon(name: string): string {
    return this.iconList.filter((i) => i.name == name)[0]?.icon;
  }
}
