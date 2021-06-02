# Catch Similar

This is a simple image retrieval website. You can upload 1 image and get 9 similar images. The website also offers a range of operational functions.

## You need to install

> * Python(64bit)
> * Flask
> * Numpy
> * Tensorflow
> * Flask-HTTPAuth
> * Flask-bootstrap

## Support OS

Only **Mac OS** and **Linux** support this code, because mac os and linux use "/" as the dictionary indicator.

If you use **Windows** and you want to run this code, you may need to You need to replace all the dictionary indicators in the code with "\\".

## How to start?

1. Download [imagenet](https://drive.google.com/open?id=1UOyZ8166qM3SzxGvaUeWpBzSUfoQLUjJ) folder, extraxt and keep it in server directory. 
2. Download datasets for [footwares](http://vision.cs.utexas.edu/projects/finegrained/utzap50k/), [apparels](http://mmlab.ie.cuhk.edu.hk/projects/DeepFashion/InShopRetrieval.html) keep them inside a directory under upload folder. Final folder strcture will be as below. 
3. The final structure will be as below:

```
      root folder  
      └───server
      |   │───database
      |   │───imagenet
      |   │───static
      |   │───templates
      |   │───uploads
      |   │───image_vectorizer.py
      |   │───search.py
      |   │───rest-server.py
```

4. Run image vectorizer which passes each data through an inception-v3 model and collects the bottleneck layer vectors and stores in disc. Edit dataset paths accordingly indide the image_vectorizer.py
   ```python
     python server/image_vectorizer.py 
   ```
      This will generate two files namely, `neighbor_list_recom.pickle` and `saved_features.txt`. Keep them inside `server` folder where `search.py` script is available.

5. Start the server by running `rest-server.py` .
   ```python
     python server/rest-server.py 
   ```

6. Follow the URL in command to access **Catch similar.**

