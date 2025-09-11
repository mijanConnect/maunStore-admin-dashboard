const handleFormSubmit = async (values) => {
  try {
    // Validate required image for new auctions
    if (!isEditing && !selectedImage) {
      message.error("Please select an image for the auction");
      return;
    }

    // Combine date and time properly
    const startDateTime =
      values.startDate && values.startTime
        ? moment(values.startDate)
            .hour(values.startTime.hour())
            .minute(values.startTime.minute())
            .second(0)
            .millisecond(0)
        : null;

    const endDateTime =
      values.endDate && values.endTime
        ? moment(values.endDate)
            .hour(values.endTime.hour())
            .minute(values.endTime.minute())
            .second(0)
            .millisecond(0)
        : null;

    // Prepare the data
    const auctionData = {
      name: values.productName,
      startDate: startDateTime?.toISOString(),
      endDate: endDateTime?.toISOString(),
      csAuraWorth: Number(values.csAuraWorth),
      creditWorth: Number(values.creditWorth),
      creditNeeds: Number(values.creditNeeds),
      normalMembership: values.membershipType === "normal",
      advanceMembership: values.membershipType === "advance",
      premiumMembership: values.membershipType === "premium",
    };

    // Add price only for new auctions or if provided in edit
    if (!isEditing || values.productPrice) {
      auctionData.price = Number(values.productPrice);
    }

    // Add status only if provided (not required for new auctions)
    if (values.status) {
      auctionData.status = values.status;
    }

    // Add editing-specific fields
    if (isEditing) {
      if (values.highestBidder) {
        auctionData.highestBidder = values.highestBidder;
      }
      if (values.highestAmount) {
        auctionData.highestAmount = Number(values.highestAmount);
      }
    }

    // FIXED: Always use FormData for consistency
    const formData = new FormData();

    // Always append the data as JSON string
    formData.append("data", JSON.stringify(auctionData));

    // Append image if selected, or send a placeholder for updates without new image
    if (selectedImage) {
      formData.append("image", selectedImage);
    } else if (isEditing) {
      formData.append("keepExistingImage", "true");
    }

    let result;

    if (isEditing) {
      result = await updateAuction({
        auctionId: editingAuction._id || editingAuction.id,
        data: formData,
      }).unwrap();
    } else {
      result = await createAuction(formData).unwrap();
    }

    message.success(
      isEditing
        ? "Auction updated successfully!"
        : "Auction created successfully!"
    );
    onSuccess();
  } catch (error) {
    console.error("Form submission error:", error);
    message.error(
      error?.data?.message ||
        `Failed to ${isEditing ? "update" : "create"} auction`
    );
  }
};
