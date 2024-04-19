
import type { Database } from '../types/supabase';

export interface FilterCondition<T extends keyof Database['public']['Tables']> {
  column: keyof Database['public']['Tables'][T]['Row'];
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'like' | 'in';
  value:any;
}

export function useFetchApi () {
  const nuxtApp = useNuxtApp()
  const supabase = useSupabaseClient<Database>()


  async function getData<T extends keyof Database['public']['Tables']>(
      tableName: T,
      filters?: FilterCondition<T>[]
    ): Promise<Database['public']['Tables'][T]['Row'][] | null> {
      let query = supabase.from(tableName as keyof Database['public']['Tables']).select();

    if (filters) {
      filters.forEach(filter => {
        const { column, operator, value } = filter;
        query = (query[operator] as any)(column, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error.message);
      return null;
    }
    return data;
  }

  async function deleteData<T extends keyof Database['public']['Tables']>(
      tableName: T,
      filters?: FilterCondition<T>[]
    ):Promise<void | null> {
    let query = supabase.from(tableName as keyof Database['public']['Tables']).delete()
    if (filters) {
      filters.forEach(filter => {
        const { column, operator, value } = filter;
        query = (query[operator] as any)(column, value);
      });
    }
    const { error } = await query;
    if (error) {
      console.error('Error fetching data:', error.message);
      return null;
    }
  }


  return { getData, deleteData }; 
}


export const getRow = () => {}
export const postRow = () => {}
export const putRow = () => {}
export const deleteRow = () => {}
