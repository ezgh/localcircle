export type ListingType = {
    id: number;
    created_at: Date | null;
    title: string;
    description: string;
    is_live: boolean;
    user: number;
    category: number;
    area: number;
    owner_name:string;

  };

export type userType = {
    first_name: string;
    last_name: string;
    id: number;
    get_full_name:string;
    profile_picture:string;
    area:number;
   
  };

export type Category = {
    id: number;
    name: string;
  };

  export type Area = {
    id: number;
    name: string;
  };

export type ListingProps = {
    listing: ListingType;
    authUserId: number | null;
    isDetail:boolean;
    isOpen:boolean;
    onDelete: (listingId: number) => void;
    listingId:number;
    accessToken:string | undefined;
    
};