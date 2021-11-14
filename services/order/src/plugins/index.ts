import { ordersPlugin } from "./orders";
import { requireAuthPlugin } from '@ecomtiago/common';

export const plugins = [
    requireAuthPlugin,
    ordersPlugin,
];
