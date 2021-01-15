# -*- coding: utf-8 -*-
from flask import Flask, render_template, request
from Bean import FoodBean
import FoodDAO

app = Flask(__name__)

@app.route("/", methods=["POST"])
#formからデータ取得
def add_userinfo():
    name = request.form.get("name")
    mail = request.form.get("mail")
    age = request.form.get("age")

    return render_template()
