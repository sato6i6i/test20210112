# -*- coding: utf-8 -*-
from flask import Flask, render_template, request
import psycopg2

app = Flask(__name__)

#herokuのdb情報
path = "ec2-52-205-61-60.compute-1.amazonaws.com"
port = "5432"
dbname = "d36otgl7q3fngd"
user = "gixiwckajckkaw"
password = "9b88574f00f12279546df4cea5efd621b51c1c9d16d96c02aaf4b9e38fd2f69c"
#db接続
conText = "host={} port={} dbname={} user={} password={}"
conText = conText.format(path,port,dbname,user,password)#文字列に変数入れ

connection = psycopg2.connect(conText)#入力間違いがあるとここでエラー
cur = connection.cursor()

@app.route("/", methods=["POST"])
#formからデータ取得、db格納
def add_userinfo():
    username = request.form.get("name")
    mailaddress = request.form.get("mail")
    age = request.form.get("age")

    cur.execute(
        'INSERT INTO user_table (username, mailaddress, age) VALUES (?,?,?)'
    )
    connection.commit()

    return render_template("AddInfo.html")

if __name__ == '__main__':
    app.debug = True
#    app.debug = False
    app.run(host='0.0.0.0', port=8000)
