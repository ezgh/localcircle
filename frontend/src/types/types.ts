export type ListingType = {
    id: number;
    created_at: Date | null;
    title: string;
    description: string;
    is_live: boolean;
    user: number;
    category: number;
    area: number;
    images: Image;
    owner_name:string;
    isBookmarked: boolean;
  };

  export type Image = {
    image: string;
  }[];


  export type MessageType = {
    id: string;
    sender: string;
    date: Date;
    receiver: string;
    user: string;
    sender_profile: {
      profile_picture: string;
      get_full_name: string;
    };
    receiver_profile: {
      profile_picture: string;
      get_full_name: string;
    };
    message: string;
    listing: ListingType;
    is_read: boolean;
    viewTime?: Date;
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
    setIsEditOpen:(isEditOpen: boolean) => void;

  
};