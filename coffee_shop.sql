--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: order_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_list (
    order_list_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer,
    subtotal numeric(10,2)
);


ALTER TABLE public.order_list OWNER TO postgres;

--
-- Name: order_list_order_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_list_order_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_list_order_list_id_seq OWNER TO postgres;

--
-- Name: order_list_order_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_list_order_list_id_seq OWNED BY public.order_list.order_list_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    order_date timestamp with time zone,
    order_type character varying(50),
    store_id integer,
    transaction_number integer,
    total_amount numeric(9,2)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_name character varying(100),
    product_price numeric(10,2),
    category_id integer,
    product_image text,
    product_type character varying(20)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    promo_id integer NOT NULL,
    promo_image text,
    promo_title character varying(255),
    promo_description text,
    active boolean DEFAULT true
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: promotions_promo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promotions_promo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promotions_promo_id_seq OWNER TO postgres;

--
-- Name: promotions_promo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promotions_promo_id_seq OWNED BY public.promotions.promo_id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    recommendation_id integer NOT NULL,
    recommendation text,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: recommendations_recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recommendations_recommendation_id_seq OWNER TO postgres;

--
-- Name: recommendations_recommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_recommendation_id_seq OWNED BY public.recommendations.recommendation_id;


--
-- Name: store_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_location (
    store_id integer NOT NULL,
    store_name character varying(100),
    address text,
    latitude numeric(9,6),
    longitude numeric(9,6)
);


ALTER TABLE public.store_location OWNER TO postgres;

--
-- Name: store_location_store_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_location_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.store_location_store_id_seq OWNER TO postgres;

--
-- Name: store_location_store_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_location_store_id_seq OWNED BY public.store_location.store_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    birth_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(10),
    email character varying(50),
    password character varying(100),
    store_id integer,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['manager'::character varying, 'owner'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: order_list order_list_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_list ALTER COLUMN order_list_id SET DEFAULT nextval('public.order_list_order_list_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: promotions promo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions ALTER COLUMN promo_id SET DEFAULT nextval('public.promotions_promo_id_seq'::regclass);


--
-- Name: recommendations recommendation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN recommendation_id SET DEFAULT nextval('public.recommendations_recommendation_id_seq'::regclass);


--
-- Name: store_location store_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_location ALTER COLUMN store_id SET DEFAULT nextval('public.store_location_store_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, category_name, status) FROM stdin;
27	Light Bites	active
28	Burger & Sandwiches	active
29	Pasta	active
30	Frappe Non-coffee base	active
31	Frappe Coffee base	active
32	Pizza	active
33	Espresso Cold	active
34	Sparkling Soda	active
35	Espresso Hot	active
36	All Day Breakfast	active
37	Chicken Wings	active
38	Cookies	active
39	Rice Meal	active
40	oaoajsdasdjkasdjkasdjklaskjdlas	inactive
\.


--
-- Data for Name: order_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_list (order_list_id, order_id, product_id, quantity, subtotal) FROM stdin;
223	86	88	2	13.98
224	86	98	1	2.99
225	87	90	1	7.50
226	87	99	2	9.00
227	88	92	1	9.99
228	88	100	1	3.99
229	89	93	2	12.00
230	89	103	1	5.00
231	90	95	1	7.25
232	90	104	2	9.98
233	91	96	1	10.50
234	91	102	1	4.25
235	92	97	1	4.99
236	92	101	1	3.50
237	93	94	1	5.99
238	93	107	2	7.98
239	94	92	1	9.99
240	94	99	1	4.50
241	95	91	1	6.50
242	95	106	1	4.50
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, order_date, order_type, store_id, transaction_number, total_amount) FROM stdin;
86	2024-01-15 20:30:00+08	dineIn	1	1001	45.50
90	2024-05-26 03:30:00+08	dineIn	1	1005	35.00
93	2024-08-22 20:15:00+08	dineIn	1	1008	37.50
88	2024-03-11 01:45:00+08	dineIn	1	1003	60.75
91	2024-06-16 04:00:00+08	dineIn	2	1006	40.00
94	2024-09-11 02:00:00+08	dineIn	2	1009	43.75
87	2024-02-02 22:00:00+08	takeOut	2	1002	30.00
89	2024-04-18 19:00:00+08	takeOut	3	1004	50.25
92	2024-07-04 21:00:00+08	takeOut	3	1007	55.25
95	2024-10-05 23:30:00+08	takeOut	3	1010	52.00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name, product_price, category_id, product_image, product_type) FROM stdin;
89	Chicken Wings Platter	8.99	37	../kape-main/src/assets/products/chicken_wings.png	meal
90	All Day Breakfast Special	7.50	36	../kape-main/src/assets/products/all_day_breakfast.png	meal
91	Garlic Butter Pasta	6.50	29	../kape-main/src/assets/products/pasta.png	meal
92	Pepperoni Pizza	9.99	32	../kape-main/src/assets/products/pizza.png	meal
93	Fried Rice and Chicken	6.00	39	../kape-main/src/assets/products/rice_meal.png	meal
94	Grilled Cheese Sandwich	5.99	28	../kape-main/src/assets/products/burger_and_sandwich.png	meal
95	Spaghetti Carbonara	7.25	29	../kape-main/src/assets/products/pasta.png	meal
96	BBQ Chicken Pizza	10.50	32	../kape-main/src/assets/products/pizza.png	meal
97	Mini Tacos	4.99	27	../kape-main/src/assets/products/light_bites.png	meal
98	Espresso Shot	2.99	35	../kape-main/src/assets/products/expresso.png	drink
99	Caramel Frappe	4.50	30	../kape-main/src/assets/products/frappe.png	drink
100	Mango Fruit Tea	3.99	34	../kape-main/src/assets/products/fruit_tea.png	drink
101	Sparkling Lemon Soda	3.50	34	../kape-main/src/assets/products/sparkling_soda.png	drink
102	Iced Mocha	4.25	33	../kape-main/src/assets/products/expresso.png	drink
103	Classic Beer Mug	5.00	31	../kape-main/src/assets/products/beer.png	drink
104	Chocolate Frappe	4.99	30	../kape-main/src/assets/products/frappe.png	drink
105	Tropical Fruit Tea	3.75	34	../kape-main/src/assets/products/fruit_tea.png	drink
106	Vanilla Milk Frappe	4.50	30	../kape-main/src/assets/products/frappe.png	drink
107	Citrus Sparkling Soda	3.99	34	../kape-main/src/assets/products/sparkling_soda.png	drink
88	Classic Beef Burger	6.99	28	../kape-main/src/assets/products/1732036664833.png	meal
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (promo_id, promo_image, promo_title, promo_description, active) FROM stdin;
4	..\\kape-main\\src\\assets\\promos\\1731834800896.jpg	Helle	asdasdl;asd	t
5	..\\kape-main\\src\\assets\\promos\\1731834811270.jpg	sdas	dasdas	t
6	..\\kape-main\\src\\assets\\promos\\1731834817715.jpg	sadasd	asdasd	t
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (recommendation_id, recommendation, date_created) FROM stdin;
\.


--
-- Data for Name: store_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_location (store_id, store_name, address, latitude, longitude) FROM stdin;
1	Coffee Beer Cafe	P. Burgos Street Barangay 10, Batangas City, 4200, Batangas	13.759106	121.055285
2	Coffee Beer Cafe	Maharlika Highway, Barangay Tiaong, 4325, Quezon	13.945031	121.360418
3	Coffee Beer Cafe	Lower Ground Level, One Ayala, 1 Ayala Ave, Makati, Metro Manila	14.550253	121.023775
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, first_name, last_name, birth_date, created_at, role, email, password, store_id) FROM stdin;
1	John	Doe	2000-01-15	2024-11-01 21:51:19.43417	owner	johndoe@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	\N
23	Jane	Smith	1988-05-23	2024-11-02 01:44:47.120686	owner	janesmith@example.com	password123	\N
26	Michael	Davis	1987-11-03	2024-11-02 01:44:47.120686	owner	michaeldavis@example.com	password123	\N
28	David	Wilson	1985-06-18	2024-11-02 01:44:47.120686	owner	davidwilson@example.com	password123	\N
31	Laura	Thomas	1994-09-12	2024-11-02 01:44:47.120686	owner	laurathomas@example.com	password123	\N
33	Megan	White	1990-03-17	2024-11-02 01:44:47.120686	owner	meganwhite@example.com	password123	\N
35	Linda	Martin	1986-01-19	2024-11-02 01:44:47.120686	owner	lindamartin@example.com	password123	\N
5	Charlie	Davis	1985-02-18	2024-11-01 21:51:19.43417	manager	charliedavis@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	3
6	Diana	Wilson	2001-04-12	2024-11-01 21:51:19.43417	manager	dianawilson@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	2
7	Ethan	Taylor	1990-09-25	2024-11-01 21:51:19.43417	manager	ethantaylor@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	1
8	Fiona	Anderson	1978-12-01	2024-11-01 21:51:19.43417	manager	fionaanderson@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	1
9	George	Thomas	1994-07-14	2024-11-01 21:51:19.43417	manager	georgethomas@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	1
10	Hannah	Moore	1993-08-19	2024-11-01 21:51:19.43417	manager	hannahmoore@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	1
12	Justmyr	Gutierrez	2024-11-21	2024-11-02 01:28:47.507752	manager	justmyrgutierrez92@gmail.com	$2b$10$6ra1XdzHNOQ1.iptyIo8m./m4bmQ0VKs9fjbnobirbja3AqLIrusa	1
13	Justmyr	Gutierrez	2024-11-21	2024-11-02 01:30:45.628182	manager	justmyrgutierrez92@gmail.com	$2b$10$pnhtumNTvW579jrKaaJJAuFgzPgRUTcxbV/ZG98kBSMyVLGXJ603G	2
14	asdasd	;adk;l	0001-02-12	2024-11-02 01:31:08.654952	manager	asd@gmail.com	$2b$10$GlMWb/zXjbF.9ynJgYjgYutEbGIfMzYXFR9Nm3MezZQjqwwiUc1m.	3
16	asdasd	;adk;l	0001-02-12	2024-11-02 01:32:15.370327	manager	asd@gmail.com	$2b$10$9Vu63RrvbDEjgOLKkGUaTOOhRH.muISz5qD6PNwNoXH1n4tOvtrHq	2
18	dasdasdasdasd	asdlasd;lk	2024-11-28	2024-11-02 01:37:31.369777	manager	asdaskdl@gmail.com	$2b$10$H8d.M2QrBv53jwoqGl/jLOE4DTW3g9MJ3csXO/eFWodY273MgG.9y	2
19	a	k	0081-03-12	2024-11-02 01:40:52.593024	manager	oiiuossdii@gmail.com	$2b$10$iRjOWIfVqyj020mQp9KtvOIhVnHWo5nRm0ZWyxRAEbQUQ4uTDpHpi	1
20	asdasldk	;lk;lkl	1989-03-12	2024-11-02 01:43:23.298077	manager	adas@s.com	$2b$10$QWwGX2L4cpmb.GdotDTUIuqz/0hHMdmIeMnegbsUJhIoJep8WJ5qa	2
21	sadasd	kljkj	0008-07-08	2024-11-02 01:43:33.999913	manager	adas@s.com	$2b$10$H6kwG.8.7NJg1lvseLB9KedVDtzc.MUfomv3vNaJ/qvClgDgWP5jS	2
24	Robert	Brown	1995-02-14	2024-11-02 01:44:47.120686	manager	robertbrown@example.com	password123	3
25	Emily	Johnson	1992-08-09	2024-11-02 01:44:47.120686	manager	emilyjohnson@example.com	password123	1
27	Sarah	Miller	1993-12-22	2024-11-02 01:44:47.120686	manager	sarahmiller@example.com	password123	2
29	Jessica	Taylor	1991-07-30	2024-11-02 01:44:47.120686	manager	jessicataylor@example.com	password123	2
30	Daniel	Anderson	1989-04-27	2024-11-02 01:44:47.120686	manager	danielanderson@example.com	password123	3
32	James	Jackson	1996-10-05	2024-11-02 01:44:47.120686	manager	jamesjackson@example.com	password123	3
34	Kevin	Harris	1992-11-21	2024-11-02 01:44:47.120686	manager	kevinharris@example.com	password123	1
36	Paul	Garcia	1994-05-02	2024-11-02 01:44:47.120686	manager	paulgarcia@example.com	password123	2
2	Jane	Smith	1995-05-22	2024-11-01 21:51:19.43417	manager	janesmitha@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	2
3	Alice	Johnson	1988-03-30	2024-11-01 21:51:19.43417	manager	asdasdasdohnson@example.com	$2b$10$hCvl/ocFbDiY9/nU1JcWbe2H2uIM5vMOkIMoXFifOmqbOOD1j/vnK	2
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 40, true);


--
-- Name: order_list_order_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_list_order_list_id_seq', 242, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 95, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 107, true);


--
-- Name: promotions_promo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_promo_id_seq', 6, true);


--
-- Name: recommendations_recommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_recommendation_id_seq', 1, false);


--
-- Name: store_location_store_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.store_location_store_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 37, true);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: order_list order_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_list
    ADD CONSTRAINT order_list_pkey PRIMARY KEY (order_list_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (promo_id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (recommendation_id);


--
-- Name: store_location store_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_location
    ADD CONSTRAINT store_location_pkey PRIMARY KEY (store_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: order_list order_list_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_list
    ADD CONSTRAINT order_list_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: order_list order_list_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_list
    ADD CONSTRAINT order_list_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: orders orders_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store_location(store_id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: users users_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store_location(store_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

