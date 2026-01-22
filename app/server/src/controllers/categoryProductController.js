import mongoose, { mongo, Mongoose } from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import {
  categoryCreateSchema,
  productCreateSchema,
} from "../schemas/ZodSchema.js";
import z from "zod";

export async function handleCreateCategory(req, res) {
  try {
    let newCategories = null;
    const rawCategories = Array.isArray(req.body) ? req.body : [req.body];
    let parsed = [];

    for (const category of rawCategories) {
      const parsedElem = categoryCreateSchema.safeParse(category);
      if (!parsedElem.success) {
        // console.log(parsedElem.error.flatten());
        return res.status(400).json({
          message: parsedElem.error.flatten() || "Incorrect data",
        });
      }
      parsed.push(parsedElem.data);
    }

    if (parsed.length)
      newCategories = await Category.insertMany(parsed, { ordered: false });
    return res.status(201).send(newCategories);
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
    const rawProducts = Array.isArray(req.body) ? req.body : [req.body];
    const parsed = [];
    for (const product of rawProducts) {
      const parsedElem = productCreateSchema.safeParse(product);
      if (!parsedElem.success) {
        return res.status(400).json({
          message: parsedElem.error.flatten() || "Incorrect data",
        });
      }
      parsed.push(product);
    }
    if (parsed.length) {
      const newProducts = await Product.insertMany(parsed);
      return res.status(201).json(newProducts);
    }
  } catch (error) {
    // if (error.code === 11000) {
    //   return res.status(409).json({
    //     message: `Product with given name already exists.`,
    //   });
    // }
    console.error(error);
    res.sendStatus(400);
  }
  res.status(400).json({ message: "No data provided" });
}

export async function handleDeleteProduct(req, res) {
  try {
    const { descriptionTag } = req.query;
    console.log(req.query);

    if (!descriptionTag) return res.sendStatus(400);
    const response = await Product.deleteMany({ description: descriptionTag });
    return res.status(200).send(response);
  } catch (error) {
    // if (error.code === 11000) {
    //   return res.status(409).json({
    //     message: `Product with given name already exists.`,
    //   });
    // }
    console.error(error);
    res.sendStatus(400);
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
      sortBy = "createdAt",
      sortOrder = "asc",
    } = req.query;

    const rawCategories = categories ?? req.query["categories[]"];
    const pipeline = [];

    const page = Math.max(1, req.query.page || 1);
    const limit = Math.min(100, req.query.limit || 10);
    const skip = limit * (page - 1);
    const estimatedTotal = await Product.estimatedDocumentCount();
    let hasNextPage = false;

    if (search) {
      pipeline.push({
        $search: {
          index: "productShortName",
          text: {
            query: search,
            path: ["nameShort", "description"],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
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

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit + 1 });

    // filter.nameShort = { $regex: new RegExp(`.*${filter.nameShort}.*`, "i") };

    const result = await Product.aggregate(pipeline);
    if (result.length > limit) {
      result.pop();
      hasNextPage = true;
    }
    // const filtered = await Product.find(filter ?? {});
    res.status(200).json({
      data: result,
      meta: {
        estimatedTotal,
        limit,
        page,
        hasNextPage,
      },
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function handleGetProductById(req, res) {
  try {
    let { id } = req.query;
    const rawIDArray = id ?? req.query["id[]"];
    let parsedIDArray = Array.isArray(rawIDArray) ? rawIDArray : [rawIDArray];

    if (!parsedIDArray)
      return res
        .status(409)
        .json({ message: "No id was provided in URL params." });

    parsedIDArray = parsedIDArray.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Product.find({
      _id: { $in: parsedIDArray },
    });
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
