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
    status character varying(20) DEFAULT 'active'::character varying,
    category_image text
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
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['manager'::character varying, 'owner'::character varying, 'admin'::character varying])::text[])))
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

COPY public.categories (category_id, category_name, status, category_image) FROM stdin;
63	Pizza	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445576/a8qa71e2ivgshhmylzfb.png
64	Espresso	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445596/oosvixfanbkxm8i9xkj1.png
65	Frappe Coffee Base	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445626/uf1nj8zcnd8gmgnrdacz.png
66	Fruit Tea	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445673/euecfyv29e0bstslxia9.png
67	Sparkling Soda	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445746/u2eq2dhhp59ji3znx6my.png
68	Beer	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445776/rngdmtvuk29ahsbyo44j.png
69	Cookies	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445805/pua6kejaz0ycxhnifc3v.png
57	All Day Breakfast	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445302/prdtxcjkm10kic0zfr89.png
58	Burger and Sandwiches	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445396/okgzedctinbcwf3log87.png
59	Rice Meal	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445449/qmtgwifr0rkbniczbodo.png
60	Light Bites	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445474/l7ltwnvej1ebaicsfog4.png
61	Pasta	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445521/bcp4aaelcws7xtfjfabj.png
62	Chicken Wings	active	http://res.cloudinary.com/dn6agdmva/image/upload/v1732445551/hxi4buhhi8aoxf6ia9rz.png
\.


--
-- Data for Name: order_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_list (order_list_id, order_id, product_id, quantity, subtotal) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, order_date, order_type, store_id, transaction_number, total_amount) FROM stdin;
117	2024-09-15 10:47:00+08	Take Out	1	999	650.00
118	2024-02-15 10:48:00+08	Take Out	1	1000	318.00
119	2024-01-03 11:08:00+08	Take Out	1	1001	1691.00
120	2024-12-12 10:44:00+08	Take Out	1	1002	556.00
121	2024-02-01 12:27:00+08	Take Out	1	1003	2352.00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name, product_price, category_id, product_image, product_type) FROM stdin;
123	FRT Green Apple	130.00	66	http://res.cloudinary.com/dn6agdmva/image/upload/v1732446102/amrplqcft48qdwecu2tw.png	drinks
124	Iced Caramel Macchiato	159.00	64	http://res.cloudinary.com/dn6agdmva/image/upload/v1732446154/kgpv24cwqje86j6c40zi.png	
125	Fries	139.00	60	http://res.cloudinary.com/dn6agdmva/image/upload/v1732446235/x9x1kvi3b4nvtr4eoeew.png	
126	Buffalo	249.00	62	http://res.cloudinary.com/dn6agdmva/image/upload/v1732446339/ycolpmxpzhg0abltntfc.png	
127	Matcha	160.00	65	http://res.cloudinary.com/dn6agdmva/image/upload/v1732446406/c5mwkuzlaetvctqvcdgb.png	drinks
128	Chicken Chops	199.00	59	http://res.cloudinary.com/dn6agdmva/image/upload/v1732446445/v5m6i3wvz0dz00z7ll7g.png	
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (promo_id, promo_image, promo_title, promo_description, active) FROM stdin;
8	http://res.cloudinary.com/dn6agdmva/image/upload/v1732217124/zlt8gx7jxuvwocxfofk0.jpg	21312	12312	t
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
38	dyasmir	gutierare	2001-12-30	2024-11-24 14:31:10.285998	admin	justmyrd.gutierrez@gmail.com	$2b$10$4bQNqcr.n1Hcu2jan4ydJ.I9.2UCXoCJzpHOPlM9TdcxF1WhDCs0C	\N
39	dyasmir	gutierare	2001-12-30	2024-11-24 14:34:06.763625	admin	just2myrd.gutierrez@gmail.com	$2b$10$4nAK4pLvdeM5N7.koiL6n.bivJ3YpXyONPPmjbjEIaEsIvgr6rfWK	\N
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 69, true);


--
-- Name: order_list_order_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_list_order_list_id_seq', 318, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 121, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 128, true);


--
-- Name: promotions_promo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_promo_id_seq', 8, true);


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

SELECT pg_catalog.setval('public.users_user_id_seq', 40, true);


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

