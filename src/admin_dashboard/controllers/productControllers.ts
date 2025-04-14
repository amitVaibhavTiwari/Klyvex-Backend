export const addNewProduct = async ({ req, res }: any) => {
  try {
    // const product = new Product();
    // const productCategory = new ProductCategory();
    // const productCategoryRelation = new ProductCategoryRelation();

    // product.name = "Product Name";
    // product.description = "Product Description";
    // product.price = 100;
    // product.stock = 50;

    // productCategory.name = "Category Name";

    // productCategoryRelation.product = product;
    // productCategoryRelation.category = productCategory;

    // await productRepository.save(product);
    // await productCategoryRepository.save(productCategory);
    // await productCategoryRelationRepository.save(productCategoryRelation);

    return res.send({
      message: "Product added successfully",
      status: true,
    });
  } catch (error: any) {
    return {
      message: error?.message || "boo",
      status: false,
    };
  }
};
