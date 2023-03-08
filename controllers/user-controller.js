import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user-model.js';

export async function createUser(req, res) {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userDoc = new UserModel({
      email: req.body.email,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      passwordHash: hash,
    });

    const user = await userDoc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'token-code',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
}

export async function login(req, res) {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'token-code',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
}

export async function getUser(req, res) {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
}
