(ns bob.lazy)

(defmacro do-lazy [& forms]
  `(fn [] ~@forms))

(defn force-lazy [x]
  (if (fn? x)
    (x)
    x))

(defn first-force [lis]
  (force-lazy (first lis)))

(defn rest-lazy [lis]
  (rest lis))

(defmacro list-lazy [& args]
  (let [l (map (fn [thingy]
                 `(do-lazy ~thingy))
               args)]
    `(list ~@l)))

(def lis
  (list-lazy 1 2 3 4 (do (println "start")
                         (Thread/sleep 3000)
                         (println "end")
                         5)))
