import { PetModel } from '../models/pet-model.js';

export async function createPet(req, res) {
  try {
    const petDoc = new PetModel({
      name: req.body.name,
      kind: req.body.kind,
      gender: req.body.gender,
      shortDesc: req.body.shortDesc,
      desc: req.body.desc,
      image: req.body.image,
      shelter: req.userId,
    });

    const pet = await petDoc.save();

    res.status(200).json(pet);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось добавить информацию о питомце',
    });
  }
}

export async function getPets(req, res) {
  try {
    const pets = await PetModel.find().populate(
      'shelter',
      'name phone address'
    );

    res.json(pets);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить информацию о питомцах',
    });
  }
}

export async function getPet(req, res) {
  try {
    const pet = await PetModel.findById(req.params.id).populate(
      'shelter',
      'name phone address'
    );

    res.json(pet);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить информацию о питомце',
    });
  }
}

export async function deletePet(req, res) {
  try {
    const pet = await PetModel.findByIdAndDelete(req.params.id);

    res.status(200).send('Информация о питомце удалена');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось удалить информацию о питомце',
    });
  }
}

export async function updatePet(req, res) {
  try {
    const { id } = req.params;
    await PetModel.findByIdAndUpdate(id, req.body);

    res.status(200).send('Информация о питомце обновлена');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось обновить информацию о питомце',
    });
  }
}
