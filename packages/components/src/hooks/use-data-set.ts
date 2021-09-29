export interface DataSet<T>{
  getItems: (from:number, count: number)=>T[] | Promise<T[]>;
  totalItems: ()=>number | Promise<number>;
}


export const useDataSet = <T>(data: T[] | DataSet<T>)=>{



  if(Array.isArray(data)){
    return data;
  }
  
}
