import Boarder from '../models/Boarder.js';

export const createBoarder = async (req, res) => {
  try {
    const { nameOfBreed, ownerInformation, priceAgreed, checkInDate, checkoutDate } = req.body;

    const boarder = new Boarder({
      nameOfBreed,
      ownerInformation,
      priceAgreed: Number(priceAgreed),
      checkInDate: new Date(checkInDate),
      checkoutDate: new Date(checkoutDate)
    });

    await boarder.save();

    res.status(201).json({
      message: 'Boarding record created successfully',
      boarder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBoarders = async (req, res) => {
  try {
    const boarders = await Boarder.find().sort({ checkInDate: -1 });
    res.json(boarders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
