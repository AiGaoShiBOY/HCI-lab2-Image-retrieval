#!flask/bin/python
################################################################################################################################
#------------------------------------------------------------------------------------------------------------------------------                                                                                                                             
# This file implements the REST layer. It uses flask micro framework for server implementation. Calls from front end reaches 
# here as json and being branched out to each projects. Basic level of validation is also being done in this file. #                                                                                                                                  	       
#-------------------------------------------------------------------------------------------------------------------------------                                                                                                                              
################################################################################################################################
from flask import Flask, jsonify, abort, request, make_response, url_for,redirect, render_template
from flask_httpauth import HTTPBasicAuth
from werkzeug.utils import secure_filename
import os
import shutil 
import numpy as np
from search import recommend
import tarfile
from datetime import datetime
from scipy import ndimage
#from scipy.misc import imsave
from flask_bootstrap import Bootstrap

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
from tensorflow.python.platform import gfile
app = Flask(__name__, static_url_path = "")
bootstrap = Bootstrap(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
auth = HTTPBasicAuth()

#==============================================================================================================================
#                                                                                                                              
#    Loading the extracted feature vectors for image retrieval                                                                 
#                                                                          						        
#                                                                                                                              
#==============================================================================================================================
extracted_features=np.zeros((10000,2048),dtype=np.float32)
with open('saved_features_recom.txt') as f:
    for i,line in enumerate(f):
        extracted_features[i,:]=line.split()
print("loaded extracted_features") 


#==============================================================================================================================
#                                                                                                                              
#  This function is used to do the image search/image retrieval
#                                                                                                                              
#==============================================================================================================================
@app.route('/imgUpload', methods=['GET', 'POST'])
#def allowed_file(filename):
#    return '.' in filename and \
#           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_img():
    print("image upload")
    result = 'static/result'
    if not gfile.Exists(result):
          os.mkdir(result)
    shutil.rmtree(result)

 
    if request.method == 'POST' or request.method == 'GET':
        print(request.method)
        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            return redirect(request.url)
        
        file = request.files['file']
        print(file.filename)
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
           
            print('No selected file')
            return redirect(request.url)
        if file:# and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if os.path.exists('static/history') is False:
                os.mkdir('static/history')
            file.seek(0)
            file.save(os.path.join('static/history', filename))

            inputloc = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print(inputloc)
            recommend(inputloc, extracted_features)
            image_path = "/result"
            image_list =[os.path.join(image_path, file) for file in os.listdir(result)
                              if not file.startswith('.')]

            # 根据每个image_list的值
            tag_list = []
            for i, img in enumerate(image_list):
                img_num = img.split("/")[-1].split(".")[0] #读取图片名
                tag_path = 'static/tags/' + img_num + '.txt'
                with open(tag_path, "r", encoding="utf-8") as file:
                    # 逐行读取标签名
                    tag = []
                    for line in file:
                        line = line.strip()
                        line = " "+line
                        tag.append(line)
                tag_list.append(tag)

            images = {
                'image0':image_list[0],
                'image1':image_list[1],
                'image2':image_list[2],
                'image3':image_list[3],
                'image4':image_list[4],
                'image5':image_list[5],
                'image6':image_list[6],
                'image7':image_list[7],
                'image8':image_list[8],
                'tag0':tag_list[0],
                'tag1': tag_list[1],
                'tag2': tag_list[2],
                'tag3': tag_list[3],
                'tag4': tag_list[4],
                'tag5': tag_list[5],
                'tag6': tag_list[6],
                'tag7': tag_list[7],
                'tag8': tag_list[8],
		    }
            print(images)
            return jsonify(images)

@app.route('/Add', methods=['GET', 'POST'])
def add_favorite():
    path = request.form['img_src']
    img_name = path.split('/')[-1]
    print(img_name)
    if os.path.exists('static/favorite') is False:
        os.mkdir('static/favorite')
    if os.path.exists('static/favorite/'+img_name):
        return jsonify(1)
    else:
        shutil.copy('static'+path,'static/favorite')
        return jsonify(2)


@app.route('/Remove', methods=['GET', 'POST'])
def remove_favorite():
    path = request.form['img_src']
    path = 'static'+path
    print(path)
    if os.path.exists(path) is False:
        return jsonify(1)
    else:
        os.remove(path)
        return jsonify(2)

@app.route('/Clear', methods=['GET', 'POST'])
def clear():
    if os.path.exists('static/history') is False:
        return jsonify(1)
    else:
        files = os.listdir('static/history')
        for file in files:
            os.remove('static/history/'+file)
        return jsonify(2)

@app.route("/RequireFavorite",methods=["GET","POST"])
def require_favorite():
    if request.method == 'POST' or request.method == 'GET':
        print(request.method)
    list = []
    files = os.listdir('static/favorite')
    for file in files:
        img_name = file.split('.')[0]
        tag_path = 'static/tags/' + img_name + '.txt'
        with open(tag_path, "r", encoding="utf-8") as txtfile:
            # 逐行读取标签名
            str = []
            for line in txtfile:
                line = line.strip()
                line = ' '+line
                str.append(line)
        img_dict = {'img_name': '/favorite/'+file, 'tags': str}
        list.append(img_dict)
    return jsonify(list)

@app.route("/RequireHistory",methods=["GET","POST"])
def require_history():
    if request.method == 'POST' or request.method == 'GET':
        print(request.method)
    list = []
    files = os.listdir('static/history')
    for file in files:
        list.append('/history/'+file)
    return jsonify(list)

@app.route("/favorite")
def favorite():
    return render_template("favorite.html")

#==============================================================================================================================
#                                                                                                                              
#                                           Main function                                                        	            #						     									       
#  				                                                                                                
#==============================================================================================================================
@app.route("/")
def main():
    return render_template("index.html")
if __name__ == '__main__':
    app.run(debug = True, host= '0.0.0.0')
