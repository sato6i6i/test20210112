import os

from flask import Flask


def create_app(test_config=None):
   #アプリの作成と構成
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        #データを安全に保つためのキー
        SECRET_KEY='dev',
        #DATABASEはSQLiteデータベースファイルが保存されるパス
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:

        app.config.from_pyfile('config.py', silent=True)
    else:

        app.config.from_mapping(test_config)


    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    #dbを登録
    from . import db
    db.init_app(app)
    #blueprintをimportして登録
    from . import auth
    app.register_blueprint(auth.bp)

    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint = 'index')

    return app
