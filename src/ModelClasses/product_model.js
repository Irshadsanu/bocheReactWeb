export class ProductModel {
    constructor(
      id,
      name,
      price,
      catId,
      catName,
      description,
      images,
      offerStatus,
      offerPrice,
      addedBy,
      addedDate
    ) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.catId = catId;
      this.catName = catName;
      this.description = description;
      this.images = images;
      this.offerStatus = offerStatus;
      this.offerPrice = offerPrice;
      this.addedBy = addedBy;
      this.addedDate = addedDate;
    }
  }