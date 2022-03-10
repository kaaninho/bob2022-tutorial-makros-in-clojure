(ns bob.switch)

;; (def y "Holiday")

;;   ;; Was wir haben wollen:
;;   (switch y
;;         ("Holiday" "I am not around")
;;         ("Work" "How can I help?")
;;         ("Night" "zzZZzzzzZZ"))

;;   ;; Wie wir es machen
;;   ;;
;;   (cond
;;   (= y "Holiday") "I am not around"
;;   (= y "Work") "How can I help?"
;;   (= y "Night") "zzZZzzzzZZ")


(comment
  (defn prepare-statement [thing statement]
    `((= ~thing ~(first statement))
      (second '~statement)))

  (defmacro switch
    [thing & statements]
    (let [prepared-statements (mapcat (fn [s] (prepare-statement thing s))
                                      statements)]
      `(cond
         ~@prepared-statements

         :else
         (throw (Exception. (str "No match, got: " ~thing)))))))

(comment
  (defn prepare-statement [thing statement]
    `((= ~thing ~(first statement))
      (second '~statement)))


  (defn prepare-more [thing statement]
    (let [[case thingy arrow then] statement]
      (prepare-statement thing (list thingy then))))

  (defmacro switch
    [thing & statements]
    (let [prepared-statements (mapcat (fn [s] (prepare-more thing s))
                                      statements)]
      `(cond
         ~@prepared-statements

         :else
         (throw (Exception. (str "No match, got: " ~thing))))))

  (let [y "Work"]
    (switch y
            (case "Holiday" -> "I am not around")
            (case "Work" -> "How can I help?")
            (case "Night" -> "zzZZzzzzZZ"))))



(defn prepare-statement [thing statement]
  `((= ~thing ~(first statement))
    (second '~statement)))


(defn prepare-more [thing statement]
  (let [[case thingy arrow then] statement]
    (prepare-statement thing (list thingy then))))

(defn prepare-statements [s]
  (partition 4 s))

(defmacro switch
  [thing & statements]
  (let [prepared-statements (mapcat (fn [s] (prepare-more thing s))
                                    (prepare-statements statements))]
    `(cond
       ~@prepared-statements

       :else
       (throw (Exception. (str "No match, got: " ~thing))))))

(let [y "Work"]
  (switch y
          case "Holiday" -> "I am not around"
          case "Work" -> "How can I help?"
          case "Night" -> "zzZZzzzzZZ"))


;;; NEU



;; (def y "Holiday")

;;   ;; Was wir haben wollen:
;;   (switch y
;;         case "Holiday" -> case "I am not around"
;;         case "Work"    -> "How can I help?"
;;         case "Night"   -> "zzZZzzzzZZ")

;;   ;; Wie wir es machen
;;   ;;
;;   (cond
;;   (= y "Holiday") "I am not around"
;;   (= y "Work") "How can I help?"
;;   (= y "Night") "zzZZzzzzZZ")


;; Zunächst vereinfacht
;; (switch "Work"
;;         ("Holiday" "I am not around")
;;         ("Work" "How can I help?"))


(defmacro switch [value form1 form2]
  `(cond
     (= ~value ~(first form1)) ~(second form1)
     (= ~value ~(first form2)) ~(second form2)))

(defmacro switch [value form1 form2]
  (list 'cond
        (list = value (first form1)) (second form1)
        (list = value (first form2)) (second form2)))


(defn prepare-form [value form]
  `((= ~value ~(second form)) ~(last form)))

(defn prepare-forms [value forms]
  (mapcat (fn [form] (prepare-form value form))
          forms))

(defmacro switch [value & forms]
  `(cond ~@(prepare-forms value (partition 4 forms))))
