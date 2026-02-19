import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Nat16 "mo:core/Nat16";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

actor {
  public type Car = {
    vinNumber : Text;
    model : Text;
    year : Nat16;
    price : Float;
    batteryCapacity : Nat;
    isForSale : Bool;
  };

  public type InventoryInit = {
    vinNumber : Text;
    model : Text;
    year : Nat16;
    price : Float;
    batteryCapacity : Nat;
    isForSale : Bool;
  };

  public type CarPreference = {
    color : Text;
    batteryCapacity : Nat;
    budget : Float;
  };

  public type UserProfile = {
    id : Principal;
    registered : Int;
    preferences : [CarPreference];
  };

  public type CustomerInquiry = {
    userId : Principal;
    carVin : Text;
    message : Text;
    timestamp : Int;
  };

  public type Order = {
    orderId : Nat;
    userId : Principal;
    carVin : Text;
    purchasePrice : Float;
    timestamp : Int;
  };

  let cars = Map.empty<Text, Car>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let inquiries = Map.empty<Nat, CustomerInquiry>();
  let orders = Map.empty<Nat, Order>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Backend admin function to add cars to inventory
  public shared ({ caller }) func addInventory(inventory : [InventoryInit]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add inventory");
    };

    for (carInit in inventory.values()) {
      let car : Car = carInit;
      cars.add(car.vinNumber, car);
    };
  };

  public shared ({ caller }) func setAvailability(vin : Text, isForSale : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set availability");
    };
    switch (cars.get(vin)) {
      case (null) { Runtime.trap("No car with this vin") };
      case (?car) {
        cars.add(vin, { car with isForSale });
      };
    };
  };

  public shared ({ caller }) func createInquiry(vin : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create inquiries");
    };
    let newInquiry = {
      userId = caller;
      carVin = vin;
      message;
      timestamp = Time.now();
    };
    let newId = inquiries.size() + 1;
    inquiries.add(newId, newInquiry);
  };

  // Backend admin function to view all customer inquiries
  public query ({ caller }) func getAllInquiries() : async [CustomerInquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    let iter = inquiries.values();
    iter.toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    let iter = orders.values();
    iter.toArray();
  };

  public query func getInventory() : async [Car] {
    let iter = cars.values();
    iter.toArray();
  };

  public shared ({ caller }) func createOrder(vin : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    switch (cars.get(vin)) {
      case (null) { Runtime.trap("Car not found") };
      case (?car) {
        if (not car.isForSale) {
          Runtime.trap("Car is not available for sale");
        };

        let orderId = orders.size() + 1;
        let newOrder : Order = {
          orderId;
          userId = caller;
          carVin = vin;
          purchasePrice = car.price;
          timestamp = Time.now();
        };
        orders.add(orderId, newOrder);

        // Mark car as sold
        cars.add(vin, { car with isForSale = false });
        orderId;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };

    let iter = orders.values();
    let allOrders = iter.toArray();
    allOrders.filter<Order>(func(order) { order.userId == caller });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
