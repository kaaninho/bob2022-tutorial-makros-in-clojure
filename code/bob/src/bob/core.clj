(ns bob.core)

;;; Kommentar

;; Ausdrücke

3

"String"

'sym

true

(* (+ 4 3) 2)

(list 1 2 3 "Hallo" (+ 1 2))

(inc 3)

(if (> 2 3)
  "It is true"
  100)

(cond
  (> 3 4) "Ich bin nicht das Ergebnis"
  (= 3 3) "Ich bin das Ergebnis"
  (> 3 2) "Ich bin nicht das Ergebnis")





















;;; Funktionen

(defn add1
  [x]
  (+ 1 x))

(defn factorial
  [n]
  (if (= n 1)
    1
    (* n (factorial (dec n)))))

;;; ENDE Syntax, Definitionen






















;;; REPL und IDE

;; Definition eines "Counters" (der keiner ist)
(def counter 15)

;; erhöhe um 1
(inc counter)

;; immer noch 15 -> immutable data
counter

;; lokale Bindungen

(let [x 5
      y 7]
  (+ x y))
























;;; Higher Order Functions

(map inc [1 2 3])

(filter even? [1 2 3])

(filter (fn [x] (> x 2)) [1 2 3])

(reduce (fn [res x]
          (assoc res (hash x) x))
        {}
        ["hallo" "du" "!"])

;;; ENDE REPL































;;; READ UND EVAL

(read-string "(+ 1 2)")
(eval (read-string "(+ 1 2)"))

;;; ENDE READ UND EVAL
























;;; Makros

(list + (list * 2 3) 4)

`(+ (* 2 3) 4)

















(defn do-something []
  (Thread/sleep 1300)
  15)

(let [before (System/currentTimeMillis)
      result (do-something)
      after  (System/currentTimeMillis)]
  (println "Needed: " (- after before) " ms.")
  result)





















;;; Switch

(def y "Work")

;; ;; (switch y
;; ;;         case "Holiday" -> "I am not around"
;; ;;         case "Work"    -> "How can I help?")


;; ;; ->

;; (cond
;;   (= y "Holiday") "I am not around"
;;   (= y "Work") "How can I help")















;; ;;; ZWISCHENSCHRITT

;; (switch y
;;         ("Holiday" "I am not around")
;;         ("Work" "How can I help?"))






















`(1 2 3 ~@(list 4 5) 6 7)







(partition 4 (list 1 2 3 4 5 6 7 8 9 10 11 12))


























;;;;; EMIT DEFS

(defmacro emit-defs [sym-name low mid high]
  `(do
     (def ~(symbol (str sym-name "-high"))
       ~high)
     (def ~(symbol (str sym-name "-mid"))
       ~mid)
     (def ~(symbol (str sym-name "-low"))
       ~low)))
