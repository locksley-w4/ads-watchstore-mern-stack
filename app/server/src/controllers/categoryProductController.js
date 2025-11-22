import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

export async function handleCreateCategory(req, res) {
  try {
    let newCategory = null;
    if (Array.isArray(req.body) && req.body?.length > 0) {
      newCategory = await Category.insertMany(req.body, { ordered: false });
      return res.status(201).send(newCategory);
    }

    newCategory = await Category.create(req.body);
    return res.status(201).send(newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Category with given name already exists.`,
      });
    }
    console.error(error);
    res.sendStatus(500);
  }
}

export async function handleCreateProduct(req, res) {
  try {
    let newProduct = null;
    if (Array.isArray(req.body) && req.body?.length > 0) {
      newProduct = await Product.insertMany(req.body);
      return res.status(201).send(newProduct);
    }

    newProduct = await Product.create(req.body);
    return res.status(201).send(newProduct);
  } catch (error) {
    // if (error.code === 11000) {
    //   return res.status(409).json({
    //     message: `Product with given name already exists.`,
    //   });
    // }
    console.error(error);
    res.sendStatus(500);
  }
}

export async function handleEditProduct(req, res) {
  try {
    const id = req.params.id;
    if (!id)
      return res
        .status(409)
        .json({ message: "Please provide ID in the url params." });

    const edited = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(201).json(edited);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function handleGetProducts(req, res) {
  try {
    // console.log(req.query);
    const {
      search,
      categories,
      brand,
      sortBy = "nameShort",
      sortOrder = "asc",
    } = req.query;

    const rawCategories = categories ?? req.query["categories[]"];
    const pipeline = [];

    if (search) {
      pipeline.push({
        $search: {
          index: "productShortName",
          text: {
            query: search,
            path: ["nameShort", "description"],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0
            },
          },
        },
      });
    }
    

    const match = {};

    if (brand) {
      match.brand = brand;
    }

    if (rawCategories) {
      const categoryList = Array.isArray(rawCategories)
        ? rawCategories
        : [rawCategories];
      match.categories = { $in: categoryList };
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({
        $match: match,
      });
    }

    pipeline.push({
      $sort: {
        [sortBy]: sortOrder === "des" ? -1 : 1,
      },
    });

    pipeline.push({ $limit: 20 });

    // filter.nameShort = { $regex: new RegExp(`.*${filter.nameShort}.*`, "i") };

    const result = await Product.aggregate(pipeline);
    // const filtered = await Product.find(filter ?? {});
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function handleGetProductById(req, res) {
  try {
    const { id } = req.params;
    console.log(req.params);
    
    if (!id) return res.status(409).json({message: "No id was provided in URL params."});
    const result = await Product.findById(id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function handleGetCategories(req, res) {
  try {
    const filter = {};
    if (req.body?.name) filter.name = req.body.name;
    const result = await Category.find(filter);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
