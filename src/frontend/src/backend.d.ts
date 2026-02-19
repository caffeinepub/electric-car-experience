import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CarPreference {
    color: string;
    budget: number;
    batteryCapacity: bigint;
}
export interface CustomerInquiry {
    userId: Principal;
    message: string;
    timestamp: bigint;
    carVin: string;
}
export interface InventoryInit {
    model: string;
    year: number;
    vinNumber: string;
    price: number;
    isForSale: boolean;
    batteryCapacity: bigint;
}
export interface Order {
    purchasePrice: number;
    userId: Principal;
    orderId: bigint;
    timestamp: bigint;
    carVin: string;
}
export interface UserProfile {
    id: Principal;
    preferences: Array<CarPreference>;
    registered: bigint;
}
export interface Car {
    model: string;
    year: number;
    vinNumber: string;
    price: number;
    isForSale: boolean;
    batteryCapacity: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addInventory(inventory: Array<InventoryInit>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createInquiry(vin: string, message: string): Promise<void>;
    createOrder(vin: string): Promise<bigint>;
    getAllInquiries(): Promise<Array<CustomerInquiry>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInventory(): Promise<Array<Car>>;
    getMyOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAvailability(vin: string, isForSale: boolean): Promise<void>;
}
