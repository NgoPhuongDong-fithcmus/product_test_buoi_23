const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // chức năng lọc
  const filterStatus = filterStatusHelper(req.query);

  // chức năng tìm kiếm
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // chức năng phân trang
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  const products = await Product.find(find)
    .sort({position: "desc"})
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash('success', 'Cập nhật trạng thái sản phẩm thành công');

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công`);
      break;
    case "unactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "unactive" });
      req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedTime: new Date() });
      req.flash('success', `Đã xóa ${ids.length} sản phẩm thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        let[id,position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
    default:
      break;
  }
  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { deleted: true, deletedTime: new Date() });

    req.flash('success', `Đã xóa sản phẩm thành công`);
  
    res.redirect("back");
  };


//[GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm"
  });
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if(!req.body.title) {
    req.flash('error', `Vui lòng nhập tiêu đề`);
    res.redirect("back");
    return;
  }
  req.body.price = parseInt(req.body.price * 1);
  req.body.discountPercentage = parseInt(req.body.discountPercentage * 1);
  req.body.stock = parseInt(req.body.stock * 1);
  if(req.body.position ==""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }
  else{
    req.body.position = parseInt(req.body.position);
  }
  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  
  const product = new Product(req.body);
  product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id : req.params.id
    }
  
    const product = await Product.findOne(find);
    console.log(product);
  
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash('error', `Trang này không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
  
}
  
//[POST] /admin/products/editPatch
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({_id: id}, req.body);
    req.flash('success', `Cập nhật sản phẩm thành công`);
  } catch (error) {
    req.flash('error', `Cập nhật sản phẩm thất bại!`);
  }
  
  res.redirect("back");
}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id : req.params.id
    }
  
    const product = await Product.findOne(find);
    console.log(product);
  
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash('error', `Trang này không tồn tại!`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
  
}

