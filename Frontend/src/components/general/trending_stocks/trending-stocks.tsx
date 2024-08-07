import { stockService } from "@/services/stocks.services";
import { useQuery } from "@tanstack/react-query";
import Marquee from "react-fast-marquee";

function TrendingStocksList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trendingStocks"],
    queryFn: () => stockService.getTrendingStocks(),
  });

  return (
    <div className=" border min-h-16 flex items-center overflow-hidden">
      {isLoading ? (
        "Loading..."
      ) : (
        <Marquee gradient={false} className=" flex gap-12">
          <ul className=" flex gap-12">
            {data?.data.map((stock, index) => (
              <li
                key={index}
                className={` flex gap-2 ${
                  index === data.data.length - 1 && "mr-12"
                } `}
              >
                <span>{stock.stock}</span> :{" "}
                <span>${stock.value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <ul className=" flex gap-12 ">
            {data?.data.map((stock, index) => (
              <li key={index} className={` flex gap-2  `}>
                <span>{stock.stock}</span> :{" "}
                <span>${stock.value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </Marquee>
      )}
    </div>
  );
}

export default TrendingStocksList;
