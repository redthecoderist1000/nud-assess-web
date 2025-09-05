import { Container } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

function CartPage() {
  // get state from navigate
  const location = useLocation();
  const { quizDetail, tosDetail } = location.state;

  //   console.log(quizDetail);
  //   console.log(tosDetail);

  return (
    <div className="m-5 ">
      <div className="bg-white border-b border-gray-200  pb-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Creation</h1>
      </div>
    </div>
  );
}

export default CartPage;
