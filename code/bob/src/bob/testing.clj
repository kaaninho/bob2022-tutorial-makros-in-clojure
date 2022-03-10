(ns bob.testing)



(defmacro m1 [a]
  `(println ~(str "Unevaluated: " a)))

(defmacro m2 [a]
  `(println "Unevaluated: " '~a))

(defmacro m3 [a]
  `(println "Evaluated: " ~a))

(m3 (+ 2 3))





















(defmacro testing [a b]
  `(do

     (if (= ~a ~b)
       (println "Test passed")
       (println "Test not passed, " '~a " = "  ~a " not the same as " '~b " = " ~b)
     )))

(testing (+ 1 2) 4)


(testing (reverse [1 2 3]) (list 3 4 2 1))
