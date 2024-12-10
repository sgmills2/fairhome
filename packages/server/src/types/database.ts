export type Database = {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          developer_id: string | null;
          title: string;
          description: string | null;
          address: string;
          location: unknown;
          price: number;
          bedrooms: number;
          bathrooms: number;
          square_feet: number;
          photos: string[];
          amenities: string[];
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}; 