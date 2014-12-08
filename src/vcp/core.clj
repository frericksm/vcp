(ns vcp.core
  (:require [liberator.core :refer [resource defresource]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.json :only [wrap-json-response]]
            [ring.middleware.json :only [wrap-json-body]]
            [compojure.core :refer [defroutes ANY]]
            ;;[compojure.route :as route]
             ))


(defresource queue [id]
  :allowed-methods [:post :get]
  :available-media-types ["application/json"]
  :handle-ok (fn [_] (format "The text is %s" txt))
  :post! (fn [ctx]
           (dosync 
            (let [body (slurp (get-in ctx [:request :body]))
                  id   (count (alter posts conj body))]
              {::id id})))
  )

(defroutes app
  (ANY "/api/queue" [] queue)
  (ANY "/foo" []
       (resource :available-media-types ["text/html"]
                 :handle-ok
                 (fn [ctx]
                   (format
                    "<html><head></head><body> It's %d milliseconds since the beginning of the epoch.</body></html>"
                    (System/currentTimeMillis))))))





(def handler 
  (-> app 
      (wrap-params)
      (wrap-resource "public")
      (wrap-content-type)
      (wrap-not-modified)
      (wrap-json-response)
      (wrap-json-body {:keywords? true :bigdecimals? true})
      ))
