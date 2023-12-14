export interface ICheckoutTabs {
  name?: string;
  tab?: string;
  iconName?: string;
  buttonChecked?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

export const checkoutTabs: ICheckoutTabs[] = [
  {
    name: 'Cart Review',
    tab: 'cart-review',
    iconName: 'cart',
    buttonChecked: false,
    disabled: false,
  },
  {
    name: 'Addresses',
    tab: 'addresses',
    iconName: 'book',
    buttonChecked: false,
    disabled: false,
  },
  {
    name: 'Shipping',
    tab: 'shipping',
    iconName: 'bicycle',
    buttonChecked: false,
    disabled: false,
  },
  {
    name: 'Payment',
    tab: 'payment',
    iconName: 'wallet',
    buttonChecked: false,
    disabled: true
  }
]