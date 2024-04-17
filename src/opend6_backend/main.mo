import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NFTClassActor "../nft/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Hash "mo:base/Hash";
import Nat8 "mo:base/Nat8";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Blob "mo:base/Blob";
actor opend {
  private type Listing = {
    itemOwner : Principal;
    itemPrice : Nat;

  };

  var mapOfNFTs = HashMap.HashMap<Principal, NFTClassActor.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

  var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

  Debug.print(debug_show(Cycles.balance()));

  public shared(msg) func mintNFT(name: Text, imgData: [Nat8]) : async Principal{
    let owner: Principal = msg.caller;

    Cycles.add(100_500_000_000);
    let newNFT = await NFTClassActor.NFT(name, owner, imgData);

    let nftPrincipal  = await newNFT.getCanisterId();
    mapOfNFTs.put(nftPrincipal, newNFT);

    addToMapOfOwners(owner, nftPrincipal);

    return nftPrincipal;
  };

  private func addToMapOfOwners(owner: Principal, nftId: Principal){
    var ownedNFTs : List.List<Principal> = switch(mapOfOwners.get(owner)){
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs:= List.push(nftId, ownedNFTs);

    mapOfOwners.put(owner, ownedNFTs);

  };
  

  public query func getOwnedNFTs(user: Principal) : async [Principal]{
    var userOwnedNFTs : List.List<Principal> = switch(mapOfOwners.get(user)){
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray(userOwnedNFTs);
  };

  public query func getListedNFTs(): async [Principal]{
   let listedItems =  Iter.toArray(mapOfListings.keys());
   return listedItems;
  };

  public shared(msg) func listItem(id: Principal, price: Nat) : async Text{
    let Item : NFTClassActor.NFT = switch(mapOfNFTs.get(id)){
      case null return ("You don't have NFT minted");
      case (?result) result;
    };

    let owner = await Item.getOwner();

    if(Principal.equal(owner, msg.caller)){
      let listedItem : Listing = {
        itemOwner = owner;
        itemPrice = price;
      };

      mapOfListings.put(id, listedItem);

      return "Success";

    }else{
      return "You don't own this NFT";
    }
  };

  public query func getOpendCanisterId(): async Principal{
    let opendId = Principal.fromActor(opend);
    return opendId;
  };

  public query func isListed(id: Principal): async Bool{
    if(mapOfListings.get(id) == null){
      return false;
    }else {
      return true;
    }
  };

  public query func getOriginalOwner(id: Principal) : async Principal{
    var listing : Listing = switch(mapOfListings.get(id)){
      case null return Principal.fromText("");
      case (?result) result;
    };

    return listing.itemOwner;
  };

  public query func getNFTprice(id: Principal): async Nat{
    var listing: Listing = switch(mapOfListings.get(id)){
      case null return 0;
      case (?result) result;
    };

    return listing.itemPrice;
  };

 public shared(msg) func completePurchase(id: Principal, ownerId: Principal, newOwnerId: Principal): async Text{
    let purchasedItem: NFTClassActor.NFT = switch(mapOfNFTs.get(id)){
      case null return "NFT is not found";
      case (?result) result;
    };

    let transferResult = await purchasedItem.transferOwnership(newOwnerId);

    if(transferResult == "Success"){
      mapOfListings.delete(id);

      var ownedNFTs : List.List<Principal> = switch(mapOfOwners.get(ownerId)){
        case null List.nil<Principal>();
        case (?result) result;
      };

      ownedNFTs:= List.filter(ownedNFTs, func(itemId: Principal):Bool{
          return itemId != id;
      });

      addToMapOfOwners(newOwnerId, id);

     return "Success";

    }else {
      return transferResult;
    }
 }

}