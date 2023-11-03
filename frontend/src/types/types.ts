export type ListingType = {
    id: number;
    created_at: Date | null;
    title: string;
    description: string;
    is_live: boolean;
    user: userType;
    category: number;
    area: number;
  };

export type userType = {
    first_name: string;
    last_name: string;
    id: number;
  };

export type Category = {
    id: number;
    name: string;
  };

export type ListingProps = {
    listing: ListingType;
    authUserId: number | null;
};