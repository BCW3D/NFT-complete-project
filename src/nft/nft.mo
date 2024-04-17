import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";

actor class NFT (name: Text, owner: Principal, imgData: [Nat8]) = this {
    private let nftName = name;
    private var nftOwner = owner;
    private let imageBytes = imgData;

    public query func getName() : async Text {
        return nftName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getImage() : async [Nat8] {
        return imageBytes;
    };

    public func getCanisterId(): async Principal{
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnership(newOwner: Principal) : async Text{
        if(msg.caller == nftOwner){
            nftOwner:= newOwner;
            return "Success";
        }else{
            return "You don't own this NFT";
        }
    }

}