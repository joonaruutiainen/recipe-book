import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
  Card,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Menu,
  Radio,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';
import { TagButton } from '../components';
import constants from '../constants';
import { RecipeDuration, RecipeIngredient, RecipeStep, RecipeTag } from '../types';

const RecipeEditor = () => {
  const { user } = useAppSelector(state => state.auth);
  const {
    selected: recipe,
    recipeEditorData,
    newRecipe,
    loadingOne: loading,
    error,
  } = useAppSelector(state => state.recipes);

  const [title, setTitle] = useState<string>(recipe?.title || '');
  const [missingTitle, setMissingTitle] = useState(false);

  const [description, setDescription] = useState<string>(recipe?.description || '');
  const [missingDescription, setMissingDescription] = useState(false);

  const [duration, setDuration] = useState<RecipeDuration>(recipe?.duration || { hours: 0, minutes: 0 });
  const [invalidDuration, setInvalidDuration] = useState(false);

  const [tags, setTags] = useState<RecipeTag[]>(recipe?.tags || []);
  const [anchorElTags, setAnchorElTags] = useState<null | HTMLDivElement>(null);
  const [tagSelection, setTagSelection] = useState<RecipeTag[]>(recipe?.tags || []);
  const tagGrid = useRef<HTMLDivElement>(null);

  const [useSubtitles, setUseSubtitles] = useState(false);
  const [subtitles, setSubtitles] = useState<string[]>(recipe?.subtitles || []);

  const [portionSize, setPortionSize] = useState<number>(recipe?.portionSize || 1);
  const [portionSizeUnit, setPortionSizeUnit] = useState<string>('annosta');

  const [ingredient, setIngredient] = useState<RecipeIngredient | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipe?.ingredients || []);
  const [missingIngredientDescription, setMissingIngredientDescription] = useState(false);
  const [invalidIngredients, setInvalidIngredients] = useState(false);

  const [instructionStep, setInstructionStep] = useState<RecipeStep | null>(null);
  const [instructions, setInstructions] = useState<RecipeStep[]>(recipe?.instructions || []);
  const [missingInstructionStepTitle, setMissingInstructionStepTitle] = useState(false);
  const [missingInstructionStepDescription, setMissingInstructionStepDescription] = useState(false);
  const [invalidInstructions, setInvalidInstructions] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (recipeEditorData) {
      setTitle(recipeEditorData.title);
      setDescription(recipeEditorData.description);
      setDuration(recipeEditorData.duration);
      setTags(recipeEditorData.tags || []);
      setSubtitles(recipeEditorData.subtitles || []);
      setPortionSize(recipeEditorData.portionSize);
      setIngredients(recipeEditorData.ingredients);
      setInstructions(recipeEditorData.instructions);
    }
  }, [dispatch, recipeEditorData]);

  const submit = () => {
    if (!title) setMissingTitle(true);
    if (!description) setMissingDescription(true);
    if (!(duration.minutes > 0) && !(duration.hours > 0)) setInvalidDuration(true);
    if (!(ingredients.length > 0)) setInvalidIngredients(true);
    if (!(instructions.length > 0)) setInvalidInstructions(true);
    if (
      user &&
      title &&
      description &&
      (duration.minutes > 0 || duration.hours > 0) &&
      ingredients.length > 0 &&
      instructions.length > 0
    ) {
      const recipeData = {
        title,
        description,
        duration,
        tags: tags.length > 0 ? tags : undefined,
        portionSize,
        subtitles: subtitles.length > 0 ? subtitles : undefined,
        ingredients,
        instructions,
        pages: 1,
        userId: user.id,
      };
      dispatch(
        recipe ? recipeActions.updateRecipe({ id: recipe.id, ...recipeData }) : recipeActions.addRecipe(recipeData)
      );
    }
  };

  const addIngredient = () => {
    if (!ingredient?.description) setMissingIngredientDescription(true);
    if (ingredient && ingredient.description) {
      setIngredients(ingredients.concat([ingredient]));
      setIngredient(null);
    }
  };

  const removeIngredient = () => {
    if (ingredient && ingredients.includes(ingredient)) setIngredients(ingredients.filter(i => i !== ingredient));
    if (missingIngredientDescription) setMissingIngredientDescription(false);
    setIngredient(null);
  };

  const editIngredient = (ingr: RecipeIngredient) => {
    setIngredients(ingredients.filter(i => i !== ingr));
    setIngredient(ingr);
  };

  const addInstructionStep = () => {
    if (!instructionStep?.title) setMissingInstructionStepTitle(true);
    if (!instructionStep?.description) setMissingInstructionStepDescription(true);
    if (instructionStep && instructionStep.title && instructionStep.description) {
      if (instructions.find(step => step.index === instructionStep.index))
        setInstructions(instructions.map(step => (step.index === instructionStep.index ? instructionStep : step)));
      else setInstructions(instructions.concat([instructionStep]).sort((a, b) => a.index - b.index));
      setInstructionStep(null);
    }
  };

  const removeInstructionStep = () => {
    if (instructionStep && instructions.includes(instructionStep))
      setInstructions(instructions.filter(i => i !== instructionStep).map((step, i) => ({ ...step, index: i + 1 })));
    if (missingInstructionStepTitle) setMissingInstructionStepTitle(false);
    if (missingInstructionStepDescription) setMissingInstructionStepDescription(false);
    setInstructionStep(null);
  };

  const editInstructionStep = (step: RecipeStep) => {
    setInstructionStep(step);
  };

  const titleEditor = (
    <Stack direction='column' width='100%'>
      <TextField
        label='Reseptin otsikko'
        value={title}
        fullWidth
        autoComplete='off'
        color='secondary'
        error={missingTitle}
        inputProps={{ maxLength: 100 }}
        onChange={e => {
          if (missingTitle) setMissingTitle(false);
          setTitle(e.target.value);
        }}
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant='subtitle1'>{title.length}/100</Typography>
      </Box>
    </Stack>
  );

  const descriptionEditor = (
    <Stack direction='column' width='100%'>
      <TextField
        label='Reseptin kuvaus'
        value={description}
        fullWidth
        autoComplete='off'
        color='secondary'
        error={missingDescription}
        multiline
        rows={4}
        inputProps={{ maxLength: 1000 }}
        onChange={e => {
          if (missingDescription) setMissingDescription(false);
          setDescription(e.target.value);
        }}
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant='subtitle1'>{description.length}/1000</Typography>
      </Box>
    </Stack>
  );

  const durationEditor = (
    <Stack direction='column' width='100%' spacing={2}>
      <Typography variant='h4'>Valmistusaika</Typography>
      <Stack direction='row' spacing={1} alignItems='center'>
        <TextField
          select
          label='h'
          value={duration.hours}
          size='small'
          color='secondary'
          error={invalidDuration}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { maxHeight: 200 },
              },
            },
          }}
          sx={{ width: '100px' }}
          onChange={e => {
            if (invalidDuration) setInvalidDuration(false);
            setDuration({ ...duration, hours: parseInt(e.target.value, 10) });
          }}
        >
          {[...Array(100).keys()].map(i => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label='min'
          value={duration.minutes}
          size='small'
          color='secondary'
          error={invalidDuration}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { maxHeight: 200 },
              },
            },
          }}
          sx={{ width: '100px' }}
          onChange={e => {
            if (invalidDuration) setInvalidDuration(false);
            setDuration({ ...duration, minutes: parseInt(e.target.value, 10) });
          }}
        >
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(i => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>
        {invalidDuration && (
          <Typography variant='body1' color='error'>
            {'< 5 min'}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  const tagEditor = (
    <Stack direction='column' width='100%' spacing={1}>
      <Typography variant='h4'>Tunnisteet</Typography>
      <Grid container spacing={1} ref={tagGrid}>
        {tags.map(tag => (
          <Grid key={tag.name} item>
            <TagButton text={tag.name} color={tag.color} />
          </Grid>
        ))}
        <Grid item>
          <Button
            variant='outlined'
            size='small'
            onClick={() => setAnchorElTags(tagGrid.current)}
            sx={{
              width: 'max-content',
              fontSize: 16,
              paddingX: 3,
              textTransform: 'none',
              borderRadius: 25,
              boxShadow: `1px 1px 3px 0px`,
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: 'transparent',
              },
            }}
          >
            muokkaa tunnisteita
          </Button>
        </Grid>
        <Menu
          anchorEl={anchorElTags}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElTags)}
          onClose={() => {
            setTagSelection(tags);
            setAnchorElTags(null);
          }}
          sx={{ mt: '20px' }}
          PaperProps={{
            style: {
              borderRadius: 7,
              maxWidth: '500px',
            },
          }}
        >
          <Stack direction='column' width='100%'>
            <Box sx={{ width: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1 }}>
              <Grid container spacing={1} width='95%'>
                {constants.tags.map(tag => (
                  <Grid key={tag.name} item>
                    <TagButton
                      text={tag.name}
                      color={tag.color}
                      selected={Boolean(tagSelection.find(t => t.name === tag.name))}
                      onClick={() =>
                        tagSelection.includes(tag)
                          ? setTagSelection(tagSelection.filter(t => t.name !== tag.name))
                          : setTagSelection(tagSelection.concat([tag]))
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Stack direction='row' width='100%' justifyContent='space-between'>
              <Button
                size='small'
                sx={{
                  fontSize: 20,
                  paddingX: 3,
                  textTransform: 'none',
                  borderRadius: 25,
                }}
                onClick={() => {
                  setAnchorElTags(null);
                  setTagSelection(tags);
                }}
              >
                Peruuta
              </Button>
              <Button
                color='secondary'
                size='small'
                sx={{
                  fontSize: 20,
                  paddingX: 3,
                  textTransform: 'none',
                  borderRadius: 25,
                }}
                onClick={() => {
                  setAnchorElTags(null);
                  setTags(tagSelection);
                }}
              >
                Tallenna
              </Button>
            </Stack>
          </Stack>
        </Menu>
      </Grid>
    </Stack>
  );

  const singleIngredientEditor = (
    <Stack direction='column' spacing={1} width='100%'>
      <Stack direction='row' spacing={1} alignItems='center' width='100%'>
        <TextField
          label='Määrä'
          type='number'
          size='small'
          color='secondary'
          value={ingredient?.quantity}
          onChange={
            ingredient ? e => setIngredient({ ...ingredient, quantity: parseFloat(e.target.value) }) : undefined
          }
          inputProps={{
            min: 0.1,
            max: 1000,
            step: 0.1,
          }}
          sx={{ width: '120px' }}
        />
        <TextField
          select
          label='Yksikkö'
          size='small'
          color='secondary'
          value={ingredient?.unit}
          onChange={ingredient ? e => setIngredient({ ...ingredient, unit: e.target.value }) : undefined}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { maxHeight: 200 },
              },
            },
          }}
          sx={{ width: '120px' }}
        >
          {constants.validUnits.map(unit => (
            <MenuItem key={unit} value={unit}>
              {unit}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TextField
        label='Kuvaus'
        size='small'
        color='secondary'
        error={missingIngredientDescription}
        inputProps={{ maxLength: 100 }}
        value={ingredient?.description}
        onChange={
          ingredient
            ? e => {
                if (missingIngredientDescription) setMissingIngredientDescription(false);
                setIngredient({ ...ingredient, description: e.target.value });
              }
            : undefined
        }
      />
      <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' width='100%'>
        <Button
          endIcon={<CloseIcon color='primary' />}
          size='small'
          onClick={removeIngredient}
          sx={{
            fontSize: 20,
            fontWeight: 'lighter',
            paddingX: 3,
            textTransform: 'none',
            borderRadius: 25,
          }}
        >
          Poista ainesosa
        </Button>
        <Button
          endIcon={<DoneIcon color='primary' />}
          size='small'
          onClick={addIngredient}
          sx={{
            fontSize: 20,
            fontWeight: 'lighter',
            paddingX: 3,
            textTransform: 'none',
            borderRadius: 25,
          }}
        >
          Tallenna
        </Button>
      </Stack>
    </Stack>
  );

  const ingredientsEditor = (
    <Stack direction='column' width='100%' spacing={2}>
      <Typography variant='h4'>Ainesosat</Typography>
      <Stack direction='row' spacing={2} justifyContent='space-between'>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Radio checked={useSubtitles} size='small' onClick={() => setUseSubtitles(!useSubtitles)} />
          <Typography variant='body1'>Jaa alaotsikoihin</Typography>
        </Stack>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography variant='body1'>Annoskoko</Typography>
          <TextField
            type='number'
            hiddenLabel
            size='small'
            color='secondary'
            value={portionSize}
            onChange={e => setPortionSize(parseInt(e.target.value, 10))}
            inputProps={{
              min: 1,
              max: 100,
            }}
            sx={{ width: '80px' }}
          />
          <TextField
            select
            hiddenLabel
            size='small'
            color='secondary'
            value={portionSizeUnit}
            onChange={e => setPortionSizeUnit(e.target.value)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 200 },
                },
              },
            }}
            sx={{ width: '120px' }}
          >
            <MenuItem value='annosta'>annosta</MenuItem>
            <MenuItem value='cm &#216;'>cm &#216;</MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <Stack direction='column' spacing={1} divider={<Divider orientation='horizontal' flexItem />}>
        {invalidIngredients && (
          <Typography variant='body1' color='error'>
            Lisää vähintään 1 ainesosa
          </Typography>
        )}
        {ingredients.map(i => (
          <Stack key={i.description} direction='row' justifyContent='flex-end' alignItems='center'>
            <div style={{ width: '20%' }}>
              {i.quantity && i.unit && (
                <Typography variant='body1'>
                  {i.quantity} {i.unit}
                </Typography>
              )}
            </div>
            <div style={{ width: 'fit-content', minWidth: '30%' }}>
              <Typography variant='body1'>{i.description}</Typography>
            </div>
            <Button
              endIcon={<EditIcon color='primary' />}
              size='small'
              onClick={() => editIngredient(i)}
              sx={{
                fontSize: 18,
                paddingX: 3,
                textTransform: 'none',
                borderRadius: 25,
              }}
            >
              Muokkaa
            </Button>
          </Stack>
        ))}
        <Stack direction='row' spacing={2} alignItems='center'>
          {!ingredient && (
            <Button
              size='small'
              startIcon={<AddIcon color='primary' />}
              onClick={() => {
                if (invalidIngredients) setInvalidIngredients(false);
                setIngredient({ quantity: 1, unit: 'kpl', description: '' });
              }}
              sx={{
                fontSize: 24,
                fontFamily: 'Segoe UI',
                fontWeight: 'lighter',
                paddingX: 3,
                textTransform: 'none',
                borderRadius: 25,
              }}
            >
              Lisää ainesosa
            </Button>
          )}
          {ingredient && singleIngredientEditor}
        </Stack>
        <div />
      </Stack>
    </Stack>
  );

  const recipeDescriptionColumn = (
    <Stack direction='column' spacing={2} width='95%' maxWidth='720px' marginRight={5} paddingBottom={500}>
      <div style={{ width: '100%', height: '350px', backgroundColor: 'white' }} />
      {titleEditor}
      {descriptionEditor}
      <Stack direction='column' width='100%' spacing={3} divider={<Divider orientation='horizontal' flexItem />}>
        {durationEditor}
        {tagEditor}
        {ingredientsEditor}
      </Stack>
    </Stack>
  );

  const instructionStepEditor = (
    <Stack direction='column' spacing={1} width='100%'>
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        width='100%'
        divider={<Divider orientation='vertical' flexItem />}
      >
        <Typography variant='h3'>{instructionStep?.index}</Typography>
        <TextField
          label='Vaiheen otsikko'
          size='small'
          color='secondary'
          fullWidth
          autoFocus
          error={missingInstructionStepTitle}
          inputProps={{ maxLength: 100 }}
          value={instructionStep?.title}
          onChange={
            instructionStep
              ? e => {
                  if (missingInstructionStepTitle) setMissingInstructionStepTitle(false);
                  setInstructionStep({ ...instructionStep, title: e.target.value });
                }
              : undefined
          }
        />
      </Stack>
      <TextField
        label='Ohjeet'
        size='small'
        color='secondary'
        error={missingInstructionStepDescription}
        inputProps={{ maxLength: 1000 }}
        autoComplete='off'
        multiline
        rows={3}
        value={instructionStep?.description}
        onChange={
          instructionStep
            ? e => {
                if (missingInstructionStepDescription) setMissingInstructionStepDescription(false);
                setInstructionStep({ ...instructionStep, description: e.target.value });
              }
            : undefined
        }
      />
      <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' width='100%'>
        <Button
          endIcon={<CloseIcon color='primary' />}
          size='small'
          onClick={removeInstructionStep}
          sx={{
            fontSize: 20,
            fontWeight: 'lighter',
            paddingX: 3,
            textTransform: 'none',
            borderRadius: 25,
          }}
        >
          Poista vaihe
        </Button>
        <Button
          endIcon={<DoneIcon color='primary' />}
          size='small'
          onClick={addInstructionStep}
          sx={{
            fontSize: 20,
            fontWeight: 'lighter',
            paddingX: 3,
            textTransform: 'none',
            borderRadius: 25,
          }}
        >
          Tallenna
        </Button>
      </Stack>
    </Stack>
  );

  const instructionsEditor = (
    <Stack direction='column' spacing={1} divider={<Divider orientation='horizontal' flexItem />} width='100%'>
      {invalidInstructions && (
        <Typography variant='body1' color='error'>
          Lisää vähintään 1 valmistusvaihe
        </Typography>
      )}
      {instructions.map(step => (
        <Stack key={step.index} direction='column' width='100%' spacing={1}>
          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='center'
            divider={<Divider orientation='vertical' flexItem />}
            spacing={2}
          >
            <Typography variant='h3' width={15}>
              {step.index}
            </Typography>
            <Typography variant='h3'>{step.title}</Typography>
          </Stack>
          <Typography variant='body1' align='justify'>
            {step.description}
          </Typography>
          <Stack direction='row' justifyContent='flex-end' width='100%'>
            <Button
              endIcon={<EditIcon color='primary' />}
              size='small'
              onClick={() => editInstructionStep(step)}
              sx={{
                fontSize: 18,
                paddingX: 3,
                textTransform: 'none',
                borderRadius: 25,
              }}
            >
              Muokkaa
            </Button>
          </Stack>
        </Stack>
      ))}
      <Stack direction='row' spacing={2} alignItems='center'>
        {!instructionStep && (
          <Button
            size='small'
            startIcon={<AddIcon color='primary' />}
            onClick={() => {
              if (invalidInstructions) setInvalidInstructions(false);
              setInstructionStep({ index: instructions.length + 1, title: '', description: '', pageNumber: 1 });
            }}
            sx={{
              fontSize: 24,
              fontFamily: 'Segoe UI',
              fontWeight: 'lighter',
              paddingX: 3,
              textTransform: 'none',
              borderRadius: 25,
            }}
          >
            Lisää vaihe
          </Button>
        )}
        {instructionStep && instructionStepEditor}
      </Stack>
      <div />
    </Stack>
  );

  const recipeInstructionsColumn = (
    <Box
      sx={{
        width: '95%',
        maxWidth: '720px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 5,
      }}
    >
      <Card
        sx={{
          width: '100%',
          height: '87vh',
          position: 'sticky',
          top: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          boxShadow: '2px 3px 15px 2px rgba(57, 53, 44, 0.4)',
          overflow: 'auto',
        }}
      >
        <Stack direction='column' justifyContent='flex-start' alignItems='center' spacing={3} sx={{ margin: 5 }}>
          <Typography variant='h2'>Valmistusohje</Typography>
          {instructionsEditor}
        </Stack>
      </Card>
    </Box>
  );

  const leftColumn = (
    <Stack
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      spacing={1}
      sx={{
        width: '100%',
        position: 'sticky',
        top: '20px',
      }}
    >
      <Button
        variant='outlined'
        onClick={() => {
          navigate('/recipes');
          dispatch(recipeActions.clearSelectedRecipe());
        }}
      >
        <ArrowBackIcon />
      </Button>
    </Stack>
  );

  const rightColumn = (
    <Stack
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      spacing={1}
      sx={{
        width: '100%',
        position: 'sticky',
        bottom: '50px',
      }}
    >
      <Button
        variant='outlined'
        size='small'
        color='secondary'
        onClick={recipe ? () => navigate(`/recipes/${recipe.id}`) : () => navigate('/')}
        sx={{
          width: '150px',
          fontSize: 20,
          paddingX: 3,
          textTransform: 'none',
          borderRadius: 25,
        }}
      >
        Peruuta
      </Button>
      <Button
        variant='contained'
        size='small'
        color='secondary'
        onClick={submit}
        sx={{
          width: '150px',
          fontSize: 20,
          paddingX: 3,
          textTransform: 'none',
          borderRadius: 25,
        }}
      >
        Tallenna
      </Button>
    </Stack>
  );

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <div style={{ width: '100%', height: '100%', paddingTop: '40px' }}>
      {(error || newRecipe) && (
        <Stack direction='column' justifyContent='center' alignItems='center' spacing={2}>
          <Typography variant='body1'>{error?.message || 'Resepti tallennettu onnistuneesti'}</Typography>
          {newRecipe && (
            <Button
              variant='contained'
              color='secondary'
              onClick={() => {
                navigate(`/recipes/${newRecipe.id}`);
                dispatch(recipeActions.clearNewRecipe());
              }}
              sx={{
                width: '200px',
                fontSize: 20,
                paddingX: 3,
                textTransform: 'none',
                borderRadius: 25,
              }}
            >
              Avaa resepti
            </Button>
          )}
          {error && (
            <Button
              variant='contained'
              color='secondary'
              onClick={() => {
                navigate('/recipeEditor');
                dispatch(recipeActions.clearError());
              }}
              sx={{
                width: '200px',
                fontSize: 20,
                paddingX: 3,
                textTransform: 'none',
                borderRadius: 25,
              }}
            >
              Muokkaa
            </Button>
          )}
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              navigate('/recipes');
              if (error) dispatch(recipeActions.clearError());
              if (newRecipe) dispatch(recipeActions.clearNewRecipe());
            }}
            sx={{
              width: '200px',
              fontSize: 20,
              paddingX: 3,
              textTransform: 'none',
              borderRadius: 25,
            }}
          >
            Palaa etusivulle
          </Button>
        </Stack>
      )}
      {!error && !newRecipe && (
        <Grid container justifyContent='center' rowSpacing={5}>
          <Grid container item xs={1.5} direction='column' alignItems='center'>
            {leftColumn}
          </Grid>
          <Grid
            container
            item
            md={10.5}
            xl={4.5}
            direction='column'
            sx={{
              alignItems: { xs: 'center', md: 'flex-start', xl: 'flex-end' },
            }}
          >
            {recipeDescriptionColumn}
          </Grid>
          <Grid
            container
            item
            md={10.5}
            xl={4.5}
            direction='column'
            sx={{
              alignItems: { xs: 'center', md: 'flex-start' },
              ml: { xs: 0, md: 5, xl: 0 },
            }}
          >
            {recipeInstructionsColumn}
          </Grid>
          <Grid container item xs={1.5} direction='column' justifyContent='flex-end' alignItems='center'>
            {rightColumn}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default RecipeEditor;
