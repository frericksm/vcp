(defproject vcp "0.1.0-SNAPSHOT"
  :plugins [[lein-ring "0.8.13"]]
  :ring {:handler vcp.core/handler}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [liberator "0.12.2"]
                 [compojure "1.3.1"]
                 [ring "1.2.1"]])
