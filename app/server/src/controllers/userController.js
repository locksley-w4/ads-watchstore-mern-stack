import User from "../models/User.js";

export async function handleUserUpdate(req, res) {
  try {
    const user = req.user;
    const newData = req.body;
    const allowedFields = ["email", "fullName", "phoneNumber"];
    const updateObj = {};

    if (!user) {
      return res.status(401).json({ message: "Please sign in and try again" });
    }

    allowedFields.forEach((field) => {
      if (newData[field]) updateObj[field] = newData[field];
    });

    if (Object.keys(updateObj).length <= 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user.id },
      {
        $set: updateObj,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        message:
          "Error updating user, re-check validity of provided new values",
      });
    }
    return res
      .status(201)
      .json({ message: "Successfully updated", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function handleGetUserData(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Please sign in and try again" });
    }
    const userData = await User.findOne({ _id: user.id });

    if (!userData) {
      return res.status(400).json({
        message: "Error retriving user data, retry later",
      });
    }
    return res
      .status(200)
      .json({ message: "Successfully retrived", user: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function handleChangePassword(req, res) {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "You must provide both old and new passwords" });
    }

    if (!id) {
      return res.status(401).json({ message: "Please sign in and try again" });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        message: "User data not found, retry later",
      });
    }

    const oldPwdValidated = await user.comparePasswords(oldPassword);

    if (!oldPwdValidated) {
      return res.status(401).json({ message: "Wrong old password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateCartContent(req, res) {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({ message: "Please sign in and try again" });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User data not found. Try again later" });
    }

    const productId = req.params.productId;
    const { quantity } = req.body;
    if (quantity < 0) {
      return res
        .status(409)
        .json({ message: "Quantity cannot be less than 0" });
    }
    await user.updateOne(
      { $set: { [`cart.${productId}`]: quantity } },
      { runValidators: true }
    );
    
    const updatedUser = await User.findOne({ _id: id });
    console.log(updatedUser.cart);
    
    // user.cart[productId] = (user.cart[productId] ?? 0) + 1;
    // console.log(updatedUser);
    // user.markModified("cart");
    // await user.save();
    res.status(200).json({ cart: updatedUser.cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// export async function addToCart(req, res) {
//   try {
//     const { id } = req.user;
//     if (!id) {
//       return res.status(401).json({ message: "Please sign in and try again" });
//     }

//     const user = await User.findOne({ _id: id });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User data not found. Try again later" });
//     }

//     const productId = req.params.productId;
//     await user.updateOne({ $inc: { [`cart.${productId}`]: 1 } });
//     const updatedUser = await User.findOne({ _id: id });
//     // user.cart[productId] = (user.cart[productId] ?? 0) + 1;
//     console.log(updatedUser);
//     // user.markModified("cart");
//     // await user.save();
//     res.status(200).json({ cart: updatedUser.cart });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

// export async function removeFromCart(req, res) {
//   try {
//     const { id } = req.user;
//     if (!id) {
//       return res.status(401).json({ message: "Please sign in and try again" });
//     }

//     const user = await User.findOne({ _id: id });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User data not found. Try again later" });
//     }

//     const productId = req.params.productId;
//     const data = await user.updateOne(
//       { $inc: { [`cart.${productId}`]: -1 } },
//       { new: true }
//     );
//     // user.cart[productId] = (user.cart[productId] ?? 0) + 1;
//     console.log(data);
//     // user.markModified("cart");
//     // await user.save();
//     res.status(201).json({ cart: data.cart });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }
export async function getCart(req, res) {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(401).json({ message: "Please sign in and try again" });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User data not found. Try again later" });
    }

    res.status(200).json({ data: user.cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
