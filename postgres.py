import psycopg2

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

sql = "insert into user_table(username,mailaddress,age) values("sato","abc@example.com",23);"
cur.execute(sql)#sql実行
connection.commit()#DBに格納
