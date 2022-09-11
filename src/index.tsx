import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

//index.jsは最初に呼び出される。
//新しい要素を作成して root.render() に渡すことで更新される。

//propsを渡す基本的な構文は、props名={値}
//propsはオブジェクトなので、obj.keyでアクセスできる。
// コンストラクタ関数における`this`はインスタンスを示すオブジェクト

type Product = {
  category: string;
  price: string;
  stocked: boolean;
  name:string;
};
const data: Array<Product> = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

const ProductCategoryRow = ({category}:{category:string}) =>{
  return(
    <tr>
      <th>{category}</th>
    </tr>
  );
}

const ProductRow = ({product}:{product:Product}) =>{

  //stockがないなら赤文字に
  const name = (product.stocked) ? product.name : <div style={{color: "red"}}>{product.name}</div>;
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

//propsはオブジェクトであり、分割代入する
const ProductTable = ({products,filterText,inStockOnly}:{products:Array<Product>,filterText:string,inStockOnly:boolean}) =>{

  //productsにforeachで処理をして,適宜カテゴリーを差し込みrowsをつくる
  const rows: Array<JSX.Element> = [];
  let lastCategory:string | null = null;
  

  products.forEach((product:Product) => {
    if (product.name.indexOf(filterText) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product} />
    );
    lastCategory = product.category;
    });
  return (
    <table>
      <tr>
        <th>Name</th>
        <th>Price</th>
      </tr>
      {rows}
    </table>
  ) ;
}


const SearchBar = ({filterText,inStockOnly,handleFilterTextChange,handleInStockChange}:{filterText:string,inStockOnly:boolean,handleFilterTextChange:(filterText: string) => void,handleInStockChange:(inStockOnly: boolean) => void}) =>{

  return(
    <form>
      <input type="text" placeholder="Search..." onChange={(e) => handleFilterTextChange(e.target.value)}/>
      <div>
        <input type="checkbox" onChange={(e) => handleInStockChange(e.target.checked)}/>
        <span>Only show products in stock</span>
      </div>
    </form>
  )
}

const FilterableProductTable = ({products}: { products: Array<Product>}) => {
  //一番上のstateでfilterText と inStockOnly を保持して、 ProductTable と SearchBar に props として渡す
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setinStockOnly] = useState(false);

  //一番上のstateを下層のコンポーネントから更新するために、useStateの関数を渡す。
  const handleFilterTextChange = (text:string) => {
    setFilterText(text);
  }
  const handleInStockChange = (bool:boolean) => {
    setinStockOnly(bool);
  }
  return (
    <div>
      <SearchBar  filterText={filterText} inStockOnly={inStockOnly} handleFilterTextChange={handleFilterTextChange} handleInStockChange={handleInStockChange}/>
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly}/>
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<FilterableProductTable products={data} />);